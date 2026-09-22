"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthUser = exports.toPrivateUser = exports.toPublicUser = exports.calculateAge = void 0;
const calculateAge = (birthday, now = new Date()) => {
    const birthDate = new Date(birthday);
    let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const birthdayHasOccurred = now.getUTCMonth() > birthDate.getUTCMonth() ||
        (now.getUTCMonth() === birthDate.getUTCMonth() &&
            now.getUTCDate() >= birthDate.getUTCDate());
    if (!birthdayHasOccurred) {
        age -= 1;
    }
    return age;
};
exports.calculateAge = calculateAge;
const toPublicUser = (user) => {
    var _a, _b, _c, _d, _e;
    return ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        photoURL: (_a = user.photoURL) !== null && _a !== void 0 ? _a : null,
        age: (0, exports.calculateAge)(user.birthday),
        school: (_b = user.school) !== null && _b !== void 0 ? _b : null,
        major: (_c = user.major) !== null && _c !== void 0 ? _c : null,
        gender: (_d = user.gender) !== null && _d !== void 0 ? _d : null,
        hobbies: (_e = user.hobbies) !== null && _e !== void 0 ? _e : [],
    });
};
exports.toPublicUser = toPublicUser;
const toPrivateUser = (user) => (Object.assign(Object.assign({}, (0, exports.toPublicUser)(user)), { email: user.email, birthday: new Date(user.birthday).toISOString() }));
exports.toPrivateUser = toPrivateUser;
const toAuthUser = (user) => {
    var _a;
    return ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoURL: (_a = user.photoURL) !== null && _a !== void 0 ? _a : null,
    });
};
exports.toAuthUser = toAuthUser;
