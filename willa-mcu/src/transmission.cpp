#include <Arduino.h>
#include "drive.h"
#include "misc.h"

#define MOTOR_PWM D5
#define MOTOR_PIN1 D6
#define MOTOR_PIN2 D7
#define MOTOR_STBY D8

#define FWD_PIN1 LOW
#define FWD_PIN2 HIGH

#define REV_PIN1 FWD_PIN2
#define REV_PIN2 FWD_PIN1

void updateTransmission(uint8_t mode, unsigned short power)
{
    int pwm_power = map(power, 0, USHORT_MAX, 0, 255);
    switch (mode)
    {
    case MODE_BRAKE:
        digitalWrite(MOTOR_STBY, HIGH);
        digitalWrite(MOTOR_PIN1, HIGH);
        digitalWrite(MOTOR_PIN2, HIGH);
        break;
    case MODE_IDLE:
        digitalWrite(MOTOR_STBY, LOW);
        digitalWrite(MOTOR_PIN1, LOW);
        digitalWrite(MOTOR_STBY, LOW);
        break;
    case MODE_FORWARD:
        digitalWrite(MOTOR_STBY, HIGH);
        digitalWrite(MOTOR_PIN1, FWD_PIN1);
        digitalWrite(MOTOR_PIN2, FWD_PIN2);
        analogWrite(MOTOR_PWM, pwm_power);
        break;
    case MODE_REVERSE:
        digitalWrite(MOTOR_STBY, HIGH);
        digitalWrite(MOTOR_PIN1, REV_PIN1);
        digitalWrite(MOTOR_PIN2, REV_PIN2);
        analogWrite(MOTOR_PWM, pwm_power);
        break;
    }
}
void setupTransmission()
{
    pinMode(MOTOR_PWM, OUTPUT);
    pinMode(MOTOR_PIN1, OUTPUT);
    pinMode(MOTOR_PIN2, OUTPUT);
    pinMode(MOTOR_STBY, OUTPUT);
    updateTransmission(MODE_IDLE, 0);
}
