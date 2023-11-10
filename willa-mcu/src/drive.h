#ifndef DRIVE_H
#define DRIVE_H

#include "command.h"

void setupDrive();
void driveTick();

extern unsigned long last_command_millis;

#endif // DRIVE_H