// automatically generated by the FlatBuffers compiler, do not modify
import * as flatbuffers from 'flatbuffers';
/**
 * @enum {number}
 */
export var Willa;
(function (Willa) {
    var DriveController;
    (function (DriveController) {
        let MotorMode;
        (function (MotorMode) {
            MotorMode[MotorMode["Idle"] = 0] = "Idle";
            MotorMode[MotorMode["Brake"] = 1] = "Brake";
            MotorMode[MotorMode["Forward"] = 2] = "Forward";
            MotorMode[MotorMode["Reverse"] = 3] = "Reverse";
        })(MotorMode = DriveController.MotorMode || (DriveController.MotorMode = {}));
        ;
    })(DriveController = Willa.DriveController || (Willa.DriveController = {}));
})(Willa || (Willa = {}));
/**
 * @constructor
 */
(function (Willa) {
    var DriveController;
    (function (DriveController) {
        class DriveControl {
            constructor() {
                this.bb = null;
                this.bb_pos = 0;
            }
            /**
             * @param number i
             * @param flatbuffers.ByteBuffer bb
             * @returns DriveControl
             */
            __init(i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            }
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DriveControl= obj
             * @returns DriveControl
             */
            static getRootAsDriveControl(bb, obj) {
                return (obj || new DriveControl()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            }
            ;
            /**
             * @param flatbuffers.ByteBuffer bb
             * @param DriveControl= obj
             * @returns DriveControl
             */
            static getSizePrefixedRootAsDriveControl(bb, obj) {
                bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                return (obj || new DriveControl()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            }
            ;
            /**
             * @returns number
             */
            steer() {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
            }
            ;
            /**
             * @returns Willa.DriveController.MotorMode
             */
            motorMode() {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : Willa.DriveController.MotorMode.Idle;
            }
            ;
            /**
             * @returns number
             */
            motorPower() {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
            }
            ;
            /**
             * @returns number
             */
            frontLights() {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
            }
            ;
            /**
             * @returns number
             */
            rearLights() {
                var offset = this.bb.__offset(this.bb_pos, 12);
                return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
            }
            ;
            /**
             * @returns number
             */
            horn() {
                var offset = this.bb.__offset(this.bb_pos, 14);
                return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             */
            static startDriveControl(builder) {
                builder.startObject(6);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number steer
             */
            static addSteer(builder, steer) {
                builder.addFieldInt16(0, steer, 0);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param Willa.DriveController.MotorMode motorMode
             */
            static addMotorMode(builder, motorMode) {
                builder.addFieldInt8(1, motorMode, Willa.DriveController.MotorMode.Idle);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number motorPower
             */
            static addMotorPower(builder, motorPower) {
                builder.addFieldInt16(2, motorPower, 0);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number frontLights
             */
            static addFrontLights(builder, frontLights) {
                builder.addFieldInt16(3, frontLights, 0);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number rearLights
             */
            static addRearLights(builder, rearLights) {
                builder.addFieldInt16(4, rearLights, 0);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @param number horn
             */
            static addHorn(builder, horn) {
                builder.addFieldInt16(5, horn, 0);
            }
            ;
            /**
             * @param flatbuffers.Builder builder
             * @returns flatbuffers.Offset
             */
            static endDriveControl(builder) {
                var offset = builder.endObject();
                return offset;
            }
            ;
            static createDriveControl(builder, steer, motorMode, motorPower, frontLights, rearLights, horn) {
                DriveControl.startDriveControl(builder);
                DriveControl.addSteer(builder, steer);
                DriveControl.addMotorMode(builder, motorMode);
                DriveControl.addMotorPower(builder, motorPower);
                DriveControl.addFrontLights(builder, frontLights);
                DriveControl.addRearLights(builder, rearLights);
                DriveControl.addHorn(builder, horn);
                return DriveControl.endDriveControl(builder);
            }
        }
        DriveController.DriveControl = DriveControl;
    })(DriveController = Willa.DriveController || (Willa.DriveController = {}));
})(Willa || (Willa = {}));
//# sourceMappingURL=serialization.js.map