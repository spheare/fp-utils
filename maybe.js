"use strict";
/** @format */
//
//	Hele lightweight Nothing / Just implementatie v2
//
exports.__esModule = true;
var Just = /** @class */ (function () {
    function Just(val) {
        this.val = val;
    }
    Just.from = function (val) {
        // niet helemaal pure maar wel handiger:
        //	Just.from(null) zou Just[null] moeten zijn, maar is hier Nothing[null]
        //	Geeft ons (bijna) gratis nullMapping doorheen de hele ketting
        return Just.fromNullable(val);
        // ipv: return new Just(val);
    };
    Just.fromNullable = function (val) {
        return val === null || val === void 0 ? Nothing.from(val) : new Just(val);
    };
    Just.fromFalsy = function (val) {
        return !!val ? new Just(val) : Nothing.from(val);
    };
    Just.prototype.map = function (f) {
        return Just.from(f(this.val));
    };
    Just.prototype.chain = function (f) {
        return f(this.val);
    };
    Just.prototype.fold = function (_, onJust) {
        return onJust(this.val);
    };
    Just.prototype.foldL = function (_, onJust) {
        return onJust(this.val);
    };
    Just.prototype.isSome = function () {
        return true;
    };
    Just.prototype.isNone = function () {
        return false;
    };
    Just.prototype.or = function (_) {
        return this.val;
    };
    Just.prototype.alt = function (_) {
        return Just.from(this.val);
    };
    Just.prototype.then = function (onJust) {
        return onJust(this.val);
    };
    Just.prototype.ap = function (v) {
        if (typeof this.val === "function") {
            var fn_1 = this.val;
            return v.map(function (x) { return fn_1(x); });
        }
        else
            throw new Error('not supported');
    };
    return Just;
}());
var Nothing = /** @class */ (function () {
    function Nothing(_) {
    }
    Nothing.from = function (val) {
        return new Nothing(val);
    };
    Nothing.prototype.map = function (_) {
        return Nothing.from();
    };
    Nothing.prototype.chain = function (_) {
        return Nothing.from();
    };
    Nothing.prototype.fold = function (nothingValue, _) {
        return nothingValue;
    };
    Nothing.prototype.foldL = function (onNothing, _) {
        return onNothing();
    };
    Nothing.prototype.isSome = function () {
        return false;
    };
    Nothing.prototype.isNone = function () {
        return true;
    };
    Nothing.prototype.or = function (nothingValue) {
        return nothingValue;
    };
    Nothing.prototype.alt = function (nothingMaybe) {
        return nothingMaybe;
    };
    Nothing.prototype.then = function (_) {
        return; // do nothing
    };
    Nothing.prototype.ap = function (v) {
        return Nothing.from();
    };
    return Nothing;
}());
exports.just = function (x) { return Just.from(x); };
exports.nothing = function (x) { return Nothing.from(x); };
exports.maybe = function (x) { return Just.fromNullable(x); };
exports.fromFalsy = function (x) { return Just.fromFalsy(x); };
exports.NOTHING = exports.nothing(null);
// export const zipMaybe2 /*: <T1, T2>(m1: Maybe<T1>, m2: Maybe<T2>) => Maybe<[T1, T2]> */ = <T1, T2>(
//     m1: Maybe<T1> | Just<T1> | Nothing<T1>,
//     m2: Maybe<T2> | Just<T2> | Nothing<T2>
// ) => m1.chain(v1 => m2.map(v2 => [v1, v2]));
exports.zipMaybe2 = function (m1, m2) { return exports.maybe(function (a) { return function (b) { return [a, b]; }; }).ap(m1).ap(m2); }; // == liftA2
// export const zipMaybe3 /*: <T1, T2, T3>(m1: Maybe<T1>, m2: Maybe<T2>, m3: Maybe<T3>) => Maybe<[T1, T2, T3]> */ = <
//     T1,
//     T2,
//     T3
// >(
//     m1: Maybe<T1>,
//     m2: Maybe<T2>,
//     m3: Maybe<T3>
// ) => m1.chain(v1 => m2.chain(v2 => m3.map(v3 => [v1, v2, v3])));
exports.zipMaybe3 = function (m1, m2, m3) { return exports.maybe(function (a) { return function (b) { return function (c) { return [a, b, c]; }; }; }).ap(m1).ap(m2).ap(m3); }; // == liftA3
exports.optionToMaybe = function (opt) { return opt.fold(exports.NOTHING, exports.maybe); };
// some tests
var yes = Just.from(true), no = Nothing.from(), SOME = function (x) { return (['JUST'].concat(x)); };
console.log(exports.zipMaybe2(yes, no).fold(['NOTHING'], SOME), exports.zipMaybe2(no, no).fold(['NOTHING'], SOME), exports.zipMaybe2(no, yes).fold(['NOTHING'], SOME), exports.zipMaybe2(yes, yes).fold(['NOTHING'], SOME));
console.log(exports.zipMaybe3(yes, yes, yes).fold(['NOTHING'], SOME), exports.zipMaybe3(yes, yes, no).fold(['NOTHING'], SOME), exports.zipMaybe3(yes, no, no).fold(['NOTHING'], SOME), exports.zipMaybe3(yes, no, yes).fold(['NOTHING'], SOME), exports.zipMaybe3(no, yes, no).fold(['NOTHING'], SOME), exports.zipMaybe3(no, no, no).fold(['NOTHING'], SOME), exports.zipMaybe3(no, no, yes).fold(['NOTHING'], SOME), exports.zipMaybe3(no, yes, yes).fold(['NOTHING'], SOME));
