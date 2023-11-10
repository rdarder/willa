#include <Servo.h>
#include "misc.h"

#define SERVO_PIN D4
Servo servo;

int fmap(float x, float in_min, float in_max, int out_min, int out_max)
{
    const int dividend = out_max - out_min;
    const float divisor = in_max - in_min;
    const float delta = x - in_min;

    return int((delta * dividend + (divisor / 2)) / divisor + out_min);
}

void setupSteering()
{
    servo.attach(SERVO_PIN);
    servo.write(90);
}

void updateSteering(short ratio)
{

    int steer_microseconds = map(ratio, SHORT_MIN, SHORT_MAX, 1000, 2000);
    servo.writeMicroseconds(steer_microseconds);
}