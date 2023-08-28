#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "ESPAsyncWebServer.h"
#include <DNSServer.h>
#include <LittleFS.h>

const char *ssid = "willa";

IPAddress local_IP(10, 0, 9, 1);
IPAddress gateway(0, 0, 0, 0);
IPAddress subnet(255, 255, 255, 0);

DNSServer dnsServer;
AsyncWebServer server(80);

void listAllFilesInDir(String dir_path)
{
  Dir dir = LittleFS.openDir(dir_path);
  while (dir.next())
  {
    if (dir.isFile())
    {
      // print file names
      Serial.print("File: ");
      Serial.println(dir_path + dir.fileName());
    }
    if (dir.isDirectory())
    {
      // print directory names
      Serial.print("Dir: ");
      Serial.println(dir_path + dir.fileName() + "/");
      // recursive file listing inside new directory
      listAllFilesInDir(dir_path + dir.fileName() + "/");
    }
  }
}

void setup()
{
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  WiFi.softAPConfig(local_IP, gateway, subnet);
  WiFi.softAP(ssid, NULL);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  if (!LittleFS.begin())
  {
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }

  dnsServer.start(53, "*", WiFi.softAPIP());
  server.serveStatic("/", LittleFS, "/web/").setDefaultFile("index.html");
  server.on("/hello", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", "Hello world"); });

  server.onNotFound([](AsyncWebServerRequest *request)
                    { request->send(404); });
  server.begin();
}

// the loop function runs over and over again forever
void loop()
{
  dnsServer.processNextRequest();
}
