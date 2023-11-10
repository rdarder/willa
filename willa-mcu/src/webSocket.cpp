#include "drive.h"
#include "command.h"
#include <ESPAsyncWebServer.h>

#undef ns
#define ns(x) FLATBUFFERS_WRAP_NAMESPACE(Willa_DriveController, x) // Specified in the schema.

AsyncWebSocket ws("/controller");

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
    AwsFrameInfo *info = (AwsFrameInfo *)arg;
    if (info->final && info->index == 0 && info->len == len && info->opcode == WS_BINARY)
    {
        ns(DriveControl_table_t) controller = ns(DriveControl_as_root(data));
        command.steer = ns(DriveControl_steer)(controller);
        command.motor_mode = ns(DriveControl_motor_mode)(controller);
        command.motor_power = ns(DriveControl_motor_power)(controller);
        command.front_lights = ns(DriveControl_front_lights)(controller);
        command.rear_lights = ns(DriveControl_rear_lights)(controller);
        command.horn = ns(DriveControl_horn)(controller);
        last_command_millis = millis();

#ifdef DEVELOPMENT
        Serial.printf("%s(%d) Steer(%d). F(%d), R(%d), H(%d)\n",
                      ns(MotorMode_name)(command.motor_mode), command.motor_power, command.steer,
                      command.front_lights, command.rear_lights, command.horn);
#endif
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
void setupWebSocket(AsyncWebServer *server)
{
    ws.onEvent(onEvent);
    server->addHandler(&ws);
}
