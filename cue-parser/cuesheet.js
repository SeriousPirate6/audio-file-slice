"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CueSheet = exports.Time = exports.Index = exports.File = exports.Track = void 0;
class Track {
    constructor(_number, type = null) {
        this.type = type;
        this.title = null;
        this.flags = null;
        this.isrc = null;
        this.performer = null;
        this.songWriter = null;
        this.pregap = null;
        this.postgap = null;
        this.indexes = null;
        this.number = _number;
    }
}
exports.Track = Track;
class File {
    constructor() {
        this.name = null;
        this.type = null;
        this.tracks = null;
    }
}
exports.File = File;
class Index {
    constructor(_number = null, time = null) {
        this.time = time;
        this.number = _number;
    }
}
exports.Index = Index;
class Time {
    constructor(min = 0, sec = 0, frame = 0) {
        this.min = min;
        this.sec = sec;
        this.frame = frame;
    }
}
exports.Time = Time;
class CueSheet {
    constructor() {
        this.catalog = null;
        this.cdTextFile = null;
        this.files = null;
        this.performer = null;
        this.songWriter = null;
        this.title = null;
        this.rem = null;
    }
    getCurrentFile() {
        if (this.files && this.files.length > 0) {
            return this.files[this.files.length - 1];
        }
        else {
            return null;
        }
    }
    getCurrentTrack() {
        return this.track;
    }
    newFile() {
        if (!this.files) {
            this.files = [];
        }
        const file = new File();
        this.files.push(file);
        return file;
    }
    newTrack(_number, type) {
        this.track = new Track(_number, type);
        return this;
    }
}
exports.CueSheet = CueSheet;
//# sourceMappingURL=cuesheet.js.map