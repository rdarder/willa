#include <Arduino.h>
#include "drive.h"
#include "steering.h"
#include "transmission.h"

unsigned long last_command_millis = 0;

void driveTick()
{
    updateSteering(command.steer);
    updateTransmission(command.motor_mode, command.motor_power);
    unsigned long now = millis();
    // if we haven' received a command in one second, reset it to the default idle command;
    if (now - last_command_millis > 1000)
    {
        command = idle_command;
    }
    // if the last command happened more than 3 minutes ago, put the device to sleep
    if (now - last_command_millis > 180000)
    {
        ESP.deepSleep(0);
    }
}

void setupDrive()
{
    last_command_millis = millis();
    setupSteering();
    setupTransmission();
}