#include <LittleFS.h>
#include "ESPAsyncWebServer.h"
#include "webSocket.h"

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

void setupWebServer()
{
    if (!LittleFS.begin())
    {
        Serial.println("An Error has occurred while mounting LittleFS");
        return;
    }
    server.serveStatic("/", LittleFS, "/web/").setDefaultFile("index.html");
    server.on("/ping", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(200, "text/plain", "Pong"); });

    server.onNotFound([](AsyncWebServerRequest *request)
                      { request->send(404); });
    setupWebSocket(&server);
    server.begin();
}