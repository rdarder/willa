#include <Arduino.h>
#include "command.h"
#include "misc.h"

#define FRONT_LIGHTS_PIN D2
#define REAR_LIGHTS_PIN D1
#define HORN_PIN D0

void setupIndicators()
{
    pinMode(FRONT_LIGHTS_PIN, OUTPUT);
    pinMode(REAR_LIGHTS_PIN, OUTPUT);
    pinMode(HORN_PIN, OUTPUT);
    tone(HORN_PIN, 440, 200);
    delay(300);
    tone(HORN_PIN, 880, 400);
    delay(400);
}
void indicatorsTick()
{
    analogWrite(FRONT_LIGHTS_PIN, map(command.front_lights, 0, USHORT_MAX, 0, 255));
    analogWrite(REAR_LIGHTS_PIN, map(command.rear_lights, 0, USHORT_MAX, 0, 255));
    if (command.horn > 0)
    {
        tone(HORN_PIN, command.horn);
    }
    else
    {
        noTone(HORN_PIN);
    }
};