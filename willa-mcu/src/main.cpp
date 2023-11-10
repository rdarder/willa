#include <Arduino.h>

#include "network.h"
#include "webServer.h"
#include "drive.h"
#include "indicators.h"

void setup()
{
  Serial.begin(9600);
  setupNetwork();
  setupWebServer();
  setupDrive();
  setupIndicators();
}

// the loop function runs over and over again forever
void loop()
{
  networkTick();
  driveTick();
  indicatorsTick();
}
