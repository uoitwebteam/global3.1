/**
 * Original project can be found here: https://github.com/inorganik/countUp.js
 *
 * LICENSE
 * -------
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __assign = this && this.__assign || Object.assign || function (t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
    t[p] = s[p];
  }
  return t;
};

// playground: stackblitz.com/edit/countup-typescript
export var CountUp = /** @class */function () {
	class CountUp {
		constructor(target, endVal, options) {
			var _this = this;
			this.target = target;
			this.endVal = endVal;
			this.options = options;
			this.version = '2.0.4';
			this.defaults = {
				startVal: 0,
				decimalPlaces: 0,
				duration: 2,
				useEasing: true,
				useGrouping: true,
				smartEasingThreshold: 999,
				smartEasingAmount: 333,
				separator: ',',
				decimal: '.',
				prefix: '',
				suffix: ''
			};
			this.finalEndVal = null; // for smart easing
			this.useEasing = true;
			this.countDown = false;
			this.error = '';
			this.startVal = 0;
			this.paused = true;
			this.count = function (timestamp) {
				if (!_this.startTime) {
					_this.startTime = timestamp;
				}
				var progress = timestamp - _this.startTime;
				_this.remaining = _this.duration - progress;
				// to ease or not to ease
				if (_this.useEasing) {
					if (_this.countDown) {
						_this.frameVal = _this.startVal - _this.easingFn(progress, 0, _this.startVal - _this.endVal, _this.duration);
					}
					else {
						_this.frameVal = _this.easingFn(progress, _this.startVal, _this.endVal - _this.startVal, _this.duration);
					}
				}
				else {
					if (_this.countDown) {
						_this.frameVal = _this.startVal - (_this.startVal - _this.endVal) * (progress / _this.duration);
					}
					else {
						_this.frameVal = _this.startVal + (_this.endVal - _this.startVal) * (progress / _this.duration);
					}
				}
				// don't go past endVal since progress can exceed duration in the last frame
				if (_this.countDown) {
					_this.frameVal = _this.frameVal < _this.endVal ? _this.endVal : _this.frameVal;
				}
				else {
					_this.frameVal = _this.frameVal > _this.endVal ? _this.endVal : _this.frameVal;
				}
				// decimal
				_this.frameVal = Math.round(_this.frameVal * _this.decimalMult) / _this.decimalMult;
				// format and print value
				_this.printValue(_this.frameVal);
				// whether to continue
				if (progress < _this.duration) {
					_this.rAF = requestAnimationFrame(_this.count);
				}
				else if (_this.finalEndVal !== null) {
					// smart easing
					_this.update(_this.finalEndVal);
				}
				else {
					if (_this.callback) {
						_this.callback();
					}
				}
			};
			// default format and easing functions
			this.formatNumber = function (num) {
				var neg = num < 0 ? '-' : '';
				var result, x, x1, x2, x3;
				result = Math.abs(num).toFixed(_this.options.decimalPlaces);
				result += '';
				x = result.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? _this.options.decimal + x[1] : '';
				if (_this.options.useGrouping) {
					x3 = '';
					for (var i = 0, len = x1.length; i < len; ++i) {
						if (i !== 0 && i % 3 === 0) {
							x3 = _this.options.separator + x3;
						}
						x3 = x1[len - i - 1] + x3;
					}
					x1 = x3;
				}
				// optional numeral substitution
				if (_this.options.numerals && _this.options.numerals.length) {
					x1 = x1.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
					x2 = x2.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
				}
				return neg + _this.options.prefix + x1 + x2 + _this.options.suffix;
			};
			this.easeOutExpo = function (t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
			};
			this.options = __assign({}, this.defaults, options);
			this.formattingFn = this.options.formattingFn ?
				this.options.formattingFn : this.formatNumber;
			this.easingFn = this.options.easingFn ?
				this.options.easingFn : this.easeOutExpo;
			this.startVal = this.validateValue(this.options.startVal);
			this.frameVal = this.startVal;
			this.endVal = this.validateValue(endVal);
			this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
			this.decimalMult = Math.pow(10, this.options.decimalPlaces);
			this.resetDuration();
			this.options.separator = String(this.options.separator);
			this.useEasing = this.options.useEasing;
			if (this.options.separator === '') {
				this.options.useGrouping = false;
			}
			this.el = typeof target === 'string' ? document.getElementById(target) : target;
			if (this.el) {
				this.printValue(this.startVal);
			}
			else {
				this.error = '[CountUp] target is null or undefined';
			}
		}
		// determines where easing starts and whether to count down or up
		determineDirectionAndSmartEasing() {
			var end = this.finalEndVal ? this.finalEndVal : this.endVal;
			this.countDown = this.startVal > end;
			var animateAmount = end - this.startVal;
			if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
				this.finalEndVal = end;
				var up = this.countDown ? 1 : -1;
				this.endVal = end + up * this.options.smartEasingAmount;
				this.duration = this.duration / 2;
			}
			else {
				this.endVal = end;
				this.finalEndVal = null;
			}
			if (this.finalEndVal) {
				this.useEasing = false;
			}
			else {
				this.useEasing = this.options.useEasing;
			}
		}
		// start animation
		start(callback) {
			if (this.error) {
				return;
			}
			this.callback = callback;
			if (this.duration > 0) {
				this.determineDirectionAndSmartEasing();
				this.paused = false;
				this.rAF = requestAnimationFrame(this.count);
			}
			else {
				this.printValue(this.endVal);
			}
		}
		// pause/resume animation
		pauseResume() {
			if (!this.paused) {
				cancelAnimationFrame(this.rAF);
			}
			else {
				this.startTime = null;
				this.duration = this.remaining;
				this.startVal = this.frameVal;
				this.determineDirectionAndSmartEasing();
				this.rAF = requestAnimationFrame(this.count);
			}
			this.paused = !this.paused;
		}
		// reset to startVal so animation can be run again
		reset() {
			cancelAnimationFrame(this.rAF);
			this.paused = true;
			this.resetDuration();
			this.startVal = this.validateValue(this.options.startVal);
			this.frameVal = this.startVal;
			this.printValue(this.startVal);
		}
		// pass a new endVal and start animation
		update(newEndVal) {
			cancelAnimationFrame(this.rAF);
			this.startTime = null;
			this.endVal = this.validateValue(newEndVal);
			if (this.endVal === this.frameVal) {
				return;
			}
			this.startVal = this.frameVal;
			if (!this.finalEndVal) {
				this.resetDuration();
			}
			this.determineDirectionAndSmartEasing();
			this.rAF = requestAnimationFrame(this.count);
		}
		printValue(val) {
			var result = this.formattingFn(val);
			if (this.el.tagName === 'INPUT') {
				var input = this.el;
				input.value = result;
			}
			else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
				this.el.textContent = result;
			}
			else {
				this.el.innerHTML = result;
			}
		}
		ensureNumber(n) {
			return typeof n === 'number' && !isNaN(n);
		}
		validateValue(value) {
			var newValue = Number(value);
			if (!this.ensureNumber(newValue)) {
				this.error = "[CountUp] invalid start or end value: " + value;
				return null;
			}
			else {
				return newValue;
			}
		}
		resetDuration() {
			this.startTime = null;
			this.duration = Number(this.options.duration) * 1000;
			this.remaining = this.duration;
		}
	}
  return CountUp;
}();