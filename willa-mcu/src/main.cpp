#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "ESPAsyncWebServer.h"
#include <DNSServer.h>
#include <LittleFS.h>

#include "controller_reader.h"
#undef ns
#define ns(x) FLATBUFFERS_WRAP_NAMESPACE(Willa_DriveController, x) // Specified in the schema.

const char *ssid = "willa";

IPAddress local_IP(10, 0, 9, 1);
IPAddress gateway(0, 0, 0, 0);
IPAddress subnet(255, 255, 255, 0);

DNSServer dnsServer;
AsyncWebServer server(80);
AsyncWebSocket ws("/controller");

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

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_BINARY)
  {
    ns(DriveControl_table_t) controller = ns(DriveControl_as_root(data));
    float_t steer = ns(DriveControl_steer)(controller);
    uint8_t motor_mode = ns(DriveControl_motor_mode)(controller);
    float_t motor_power = ns(DriveControl_motor_power)(controller);
    Serial.printf("Motor Mode: %d\n", motor_mode);
    Serial.printf("Motor Power: %f\n", motor_power);
    Serial.printf("Steering: %f\n", steer);
  }
}
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  switch (type)
  {
  case WS_EVT_CONNECT:
    Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
    break;
  case WS_EVT_DISCONNECT:
    Serial.printf("WebSocket client #%u disconnected\n", client->id());
    break;
  case WS_EVT_DATA:
    handleWebSocketMessage(arg, data, len);
    break;
  case WS_EVT_PONG:
  case WS_EVT_ERROR:
    break;
  }
}
void initWebSocket()
{
  ws.onEvent(onEvent);
  server.addHandler(&ws);
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
  initWebSocket();
  server.begin();
}

// the loop function runs over and over again forever
void loop()
{
  dnsServer.processNextRequest();
}
