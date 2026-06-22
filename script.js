/**
 * CronBox - 完整交互逻辑
 * 原生 JavaScript，无第三方依赖
 * UI 样式使用 Tailwind CSS CDN 类名
 */
(function () {
  'use strict';

  // ============================================================
  // 常量配置
  // ============================================================

  var STORAGE_KEY = 'crontab_expression';

  /** 五个字段的定义 */
  var FIELD_DEFS = [
    { key: 'minute',  label: '分钟', labelKey: 'index.field_minute', rangeStart: 0,  rangeEnd: 59 },
    { key: 'hour',    label: '小时', labelKey: 'index.field_hour',   rangeStart: 0,  rangeEnd: 23 },
    { key: 'day',     label: '日',   labelKey: 'index.field_day',    rangeStart: 1,  rangeEnd: 31 },
    { key: 'month',   label: '月',   labelKey: 'index.field_month',  rangeStart: 1,  rangeEnd: 12 },
    { key: 'week',    label: '星期', labelKey: 'index.field_week',   rangeStart: 0,  rangeEnd: 7  }
  ];

  /** 8 个常用预设 */
  var PRESETS = [
    { label: '每分钟执行',   expr: '* * * * *'   },
    { label: '每小时执行',   expr: '0 * * * *'   },
    { label: '每天凌晨0点',  expr: '0 0 * * *'   },
    { label: '每天早上8点',  expr: '0 8 * * *'   },
    { label: '每周一凌晨',   expr: '0 0 * * 1'   },
    { label: '每月1号凌晨',  expr: '0 0 1 * *'   },
    { label: '工作日执行',   expr: '0 0 * * 1-5' },
    { label: '每月最后一天', expr: '0 0 L * *'   }
  ];

  /** 星期映射（支持 i18n） */
  var WEEKDAY_MAP = {
    0: { label: '周日', key: 'index.weekday_0' },
    1: { label: '周一', key: 'index.weekday_1' },
    2: { label: '周二', key: 'index.weekday_2' },
    3: { label: '周三', key: 'index.weekday_3' },
    4: { label: '周四', key: 'index.weekday_4' },
    5: { label: '周五', key: 'index.weekday_5' },
    6: { label: '周六', key: 'index.weekday_6' },
    7: { label: '周日', key: 'index.weekday_0' }
  };

  /** 获取字段的 i18n 标签 */
  function getFieldLabel(def) {
    return (window.t && def.labelKey) ? window.t(def.labelKey) : def.label;
  }

  /** 获取星期的 i18n 名称 */
  function getWeekdayName(n) {
    var entry = WEEKDAY_MAP[n];
    if (!entry) return String(n);
    return (window.t && entry.key) ? window.t(entry.key) : entry.label;
  }

  // ============================================================
  // DOM 引用缓存
  // ============================================================
  var els = {};

  function cacheDom() {
    els.header         = document.getElementById('site-header');
    els.exprInput      = document.getElementById('cron-expression');
    els.btnCopy        = document.getElementById('btn-copy');
    els.genColumns     = document.getElementById('generator-columns');
    els.presetContainer = document.getElementById('preset-container');
    els.reverseInput   = document.getElementById('reverse-input');
    els.reverseResult  = document.getElementById('reverse-result');
  }

  // ============================================================
  // 模块0：顶部导航 —— 滚动置顶（CSS sticky 作为主方案，JS 作为兜底）
  // ============================================================
  function initStickyHeader() {
    if (!els.header) return;

    // 检查浏览器是否支持 CSS sticky
    var supportsSticky = (function () {
      var el = document.createElement('div');
      el.style.position = 'sticky';
      return el.style.position === 'sticky';
    })();

    if (supportsSticky) return; // CSS sticky 生效，不需要 JS

    // Fallback: JS 实现 fixed 定位
    var placeholder = document.createElement('div');
    placeholder.id = 'header-placeholder';
    placeholder.style.height = els.header.offsetHeight + 'px';
    placeholder.style.display = 'none';
    els.header.parentNode.insertBefore(placeholder, els.header);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 0) {
        els.header.style.position = 'fixed';
        els.header.style.top = '0';
        els.header.style.left = '0';
        els.header.style.width = '100%';
        els.header.style.zIndex = '1000';
        placeholder.style.display = 'block';
      } else {
        els.header.style.position = '';
        els.header.style.width = '';
        placeholder.style.display = 'none';
      }
    });
  }

  // ============================================================
  // 模块1：表达式结果展示区
  // ============================================================

  /** 从 localStorage 恢复上次的表达式 */
  function loadExpressionFromStorage() {
    if (!els.exprInput) return '';
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        els.exprInput.value = saved;
        return saved;
      }
    } catch (e) { /* localStorage 不可用 */ }
    return '';
  }

  /** 保存表达式到 localStorage */
  function saveExpressionToStorage(expr) {
    try {
      localStorage.setItem(STORAGE_KEY, expr);
    } catch (e) { /* localStorage 不可用 */ }
  }

  /** 更新顶部表达式输入框 */
  function setExpression(expr) {
    els.exprInput.value = expr;
    saveExpressionToStorage(expr);
  }

  /** 复制按钮：复制到剪贴板，按钮变为绿色「已复制」1 秒后恢复 */
  function initCopyButton() {
    if (!els.btnCopy || !els.exprInput) return;

    var originalText = els.btnCopy.textContent;
    var timeoutId = null;

    els.btnCopy.addEventListener('click', function () {
      var value = els.exprInput.value.trim();
      if (!value) return;

      var onSuccess = function () {
        // 变为绿色「已复制」
        els.btnCopy.textContent = window.t ? window.t('index.copied') : '已复制';
        els.btnCopy.classList.remove('bg-primary', 'hover:bg-primary-hover');
        els.btnCopy.classList.add('bg-[#00B42A]');
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          els.btnCopy.textContent = originalText;
          els.btnCopy.classList.remove('bg-[#00B42A]');
          els.btnCopy.classList.add('bg-primary', 'hover:bg-primary-hover');
          timeoutId = null;
        }, 1000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(onSuccess).catch(function () {
          fallbackCopy(value, onSuccess);
        });
      } else {
        fallbackCopy(value, onSuccess);
      }
    });

    function fallbackCopy(text, callback) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        if (callback) callback();
      } catch (e) {
        /* 复制失败，静默处理 */
      }
      document.body.removeChild(textarea);
    }
  }

  // ============================================================
  // 模块2：可视化生成区
  // ============================================================

  /** 构建单个字段的 HTML（模式：每 / 指定 / 范围） */
  function buildFieldHTML(def) {
    var rangeLabel = def.key === 'week'
      ? (window.t ? window.t('index.field_desc_week') : '(0-7，0和7=周日)')
      : '(' + def.rangeStart + '-' + def.rangeEnd + ')';

    return '' +
      '<div class="field-col flex-1 min-w-0 bg-gray-50 rounded-btn p-3" data-field="' + def.key + '">' +
        '<h3 class="text-sm font-semibold text-text-main mb-2">' + getFieldLabel(def) + ' <small class="text-text-muted font-normal">' + rangeLabel + '</small></h3>' +

        // 模式选择
        '<div class="field-mode flex flex-wrap gap-2 text-xs mb-2">' +
          '<label class="cursor-pointer text-text-secondary hover:text-primary transition-btn">' +
            '<input type="radio" name="mode-' + def.key + '" value="every" checked> 每' +
          '</label>' +
          '<label class="cursor-pointer text-text-secondary hover:text-primary transition-btn">' +
            '<input type="radio" name="mode-' + def.key + '" value="specific"> 指定' +
          '</label>' +
          '<label class="cursor-pointer text-text-secondary hover:text-primary transition-btn">' +
            '<input type="radio" name="mode-' + def.key + '" value="range"> 范围' +
          '</label>' +
        '</div>' +

        // 模式面板：每
        '<div class="mode-panel mode-every" data-mode-panel="every">' +
          '<span class="text-xs text-text-muted">匹配所有 ' + getFieldLabel(def) + '</span>' +
          '<div class="flex items-center gap-1 mt-1">' +
            '<label class="text-xs text-text-muted whitespace-nowrap">步长：</label>' +
            '<input type="number" class="input-step w-14 px-2 py-1 text-xs border border-gray-300 rounded-btn focus:outline-none focus:border-primary transition-btn" min="1" max="' + def.rangeEnd + '" placeholder="无">' +
          '</div>' +
        '</div>' +

        // 模式面板：指定值
        '<div class="mode-panel mode-specific" data-mode-panel="specific" style="display:none;">' +
          '<input type="text" class="input-specific w-full px-2 py-1 text-xs border border-gray-300 rounded-btn focus:outline-none focus:border-primary transition-btn" placeholder="多个值用逗号分隔，如 1,3,5">' +
        '</div>' +

        // 模式面板：范围
        '<div class="mode-panel mode-range" data-mode-panel="range" style="display:none;">' +
          '<div class="flex items-center gap-1 text-xs">' +
            '<input type="number" class="input-range-start w-14 px-2 py-1 border border-gray-300 rounded-btn focus:outline-none focus:border-primary transition-btn" min="' + def.rangeStart + '" max="' + def.rangeEnd + '" placeholder="起始">' +
            '<span class="text-text-muted">—</span>' +
            '<input type="number" class="input-range-end w-14 px-2 py-1 border border-gray-300 rounded-btn focus:outline-none focus:border-primary transition-btn" min="' + def.rangeStart + '" max="' + def.rangeEnd + '" placeholder="结束">' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /** 构建全部5个字段的 UI */
  function buildGeneratorUI() {
    if (!els.genColumns) return;
    var html = '';
    for (var i = 0; i < FIELD_DEFS.length; i++) {
      html += buildFieldHTML(FIELD_DEFS[i]);
    }
    els.genColumns.innerHTML = html;

    // 绑定模式切换事件
    bindGeneratorEvents();
  }

  /** 绑定生成器事件：模式切换、输入变动 → 实时更新表达式 */
  function bindGeneratorEvents() {
    if (!els.genColumns) return;

    // 模式切换
    var modeRadios = els.genColumns.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < modeRadios.length; i++) {
      modeRadios[i].addEventListener('change', function () {
        var col = this.closest('.field-col');
        switchModePanel(col, this.value);
        onGeneratorChange();
      });
    }

    // 输入框变动（步长、指定值、范围）
    var inputs = els.genColumns.querySelectorAll('input[type="text"], input[type="number"]');
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].addEventListener('input', onGeneratorChange);
    }
  }

  /** 切换字段的模式面板显示 */
  function switchModePanel(col, mode) {
    var panels = col.querySelectorAll('.mode-panel');
    for (var i = 0; i < panels.length; i++) {
      panels[i].style.display = (panels[i].getAttribute('data-mode-panel') === mode) ? '' : 'none';
    }
  }

  /** 生成器任意输入变动时：重新计算表达式并更新顶部输入框 */
  function onGeneratorChange() {
    var expr = buildExpressionFromGenerator();
    setExpression(expr);
  }

  /** 从生成器当前状态拼出 5 段表达式 */
  function buildExpressionFromGenerator() {
    var parts = [];
    for (var i = 0; i < FIELD_DEFS.length; i++) {
      parts.push(getFieldExpression(FIELD_DEFS[i]));
    }
    return parts.join(' ');
  }

  /** 获取单个字段的表达式值 */
  function getFieldExpression(def) {
    var col = document.querySelector('.field-col[data-field="' + def.key + '"]');
    if (!col) return '*';

    var modeRadio = col.querySelector('input[name="mode-' + def.key + '"]:checked');
    var mode = modeRadio ? modeRadio.value : 'every';

    if (mode === 'every') {
      var stepInput = col.querySelector('.input-step');
      var step = stepInput ? parseInt(stepInput.value, 10) : NaN;
      if (step && step > 0) {
        return '*/' + step;
      }
      return '*';
    }

    if (mode === 'specific') {
      var specificInput = col.querySelector('.input-specific');
      var raw = specificInput ? specificInput.value.trim() : '';
      if (!raw) return '*';
      raw = raw.replace(/\s+/g, '');
      if (!raw) return '*';
      return raw;
    }

    if (mode === 'range') {
      var startInput = col.querySelector('.input-range-start');
      var endInput   = col.querySelector('.input-range-end');
      var start = startInput ? parseInt(startInput.value, 10) : NaN;
      var end   = endInput   ? parseInt(endInput.value, 10)   : NaN;

      if (isNaN(start) || isNaN(end)) return '*';
      if (start === end) return String(start);

      // 确保 start < end
      if (start > end) { var tmp = start; start = end; end = tmp; }

      // 约束在合法范围
      start = clamp(start, def.rangeStart, def.rangeEnd);
      end   = clamp(end,   def.rangeStart, def.rangeEnd);

      return start + '-' + end;
    }

    return '*';
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /** 根据表达式同步回生成器 UI 状态 */
  function syncGeneratorFromExpression(expr) {
    if (!els.genColumns) return;
    var parts = expr.split(/\s+/);
    if (parts.length !== 5) return;

    for (var i = 0; i < FIELD_DEFS.length; i++) {
      var def = FIELD_DEFS[i];
      var col = document.querySelector('.field-col[data-field="' + def.key + '"]');
      if (!col) continue;

      var val = parts[i];

      if (val === '*') {
        setFieldMode(col, def, 'every');
        clearFieldInputs(col);
      } else if (val.indexOf('*/') === 0) {
        setFieldMode(col, def, 'every');
        var stepInput = col.querySelector('.input-step');
        if (stepInput) stepInput.value = val.substring(2);
      } else if (val.indexOf('-') > -1) {
        var rangeParts = val.split('-');
        setFieldMode(col, def, 'range');
        var startInp = col.querySelector('.input-range-start');
        var endInp   = col.querySelector('.input-range-end');
        if (startInp) startInp.value = rangeParts[0];
        if (endInp)   endInp.value   = rangeParts[1];
      } else {
        setFieldMode(col, def, 'specific');
        var specificInput = col.querySelector('.input-specific');
        if (specificInput) specificInput.value = val;
      }
    }
  }

  function setFieldMode(col, def, mode) {
    var radio = col.querySelector('input[name="mode-' + def.key + '"][value="' + mode + '"]');
    if (radio) radio.checked = true;
    switchModePanel(col, mode);
  }

  function clearFieldInputs(col) {
    var stepInput = col.querySelector('.input-step');
    var specificInput = col.querySelector('.input-specific');
    var startInp = col.querySelector('.input-range-start');
    var endInp = col.querySelector('.input-range-end');
    if (stepInput) stepInput.value = '';
    if (specificInput) specificInput.value = '';
    if (startInp) startInp.value = '';
    if (endInp) endInp.value = '';
  }

  // ============================================================
  // 模块3：常用预设按钮
  // ============================================================

  function buildPresetButtons() {
    if (!els.presetContainer) return;
    var html = '';
    for (var i = 0; i < PRESETS.length; i++) {
      html += '<button class="preset-btn px-4 py-2 text-sm font-medium' +
                ' border border-primary text-primary bg-white rounded-btn' +
                ' hover:bg-[#E8F3FF] active:bg-[#D0E6FF] transition-btn cursor-pointer"' +
                ' data-expr="' + escapeHTML(PRESETS[i].expr) + '">' +
                escapeHTML(PRESETS[i].label) +
              '</button>';
    }
    els.presetContainer.innerHTML = html;

    // 绑定点击事件
    var buttons = els.presetContainer.querySelectorAll('.preset-btn');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].addEventListener('click', function () {
        var expr = this.getAttribute('data-expr');
        applyPreset(expr);
      });
    }
  }

  function applyPreset(expr) {
    setExpression(expr);
    syncGeneratorFromExpression(expr);
    if (els.reverseInput) {
      els.reverseInput.value = expr;
      triggerReverseParse();
    }
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ============================================================
  // 模块4：反向解析（实时）
  // ============================================================

  function initReverseParse() {
    if (!els.reverseInput || !els.reverseResult) return;
    els.reverseInput.addEventListener('input', function () {
      triggerReverseParse();
    });
  }

  function triggerReverseParse() {
    var raw = els.reverseInput.value.trim();
    if (!raw) {
      els.reverseResult.innerHTML = '<p class="text-text-muted text-sm">' + (window.t ? window.t('index.reverse_default') : '请输入 Crontab 表达式，自动实时解析') + '</p>';
      return;
    }

    var parts = raw.split(/\s+/);
    if (parts.length !== 5) {
      els.reverseResult.innerHTML = '<p class="text-error text-sm font-medium">' + (window.t ? window.t('index.err_fields_count', { count: parts.length }) : '表达式格式错误：需要 5 个字段（分钟 小时 日 月 星期），当前检测到 ' + parts.length + ' 个字段') + '</p>';
      return;
    }

    // 逐字段验证
    var errors = validateFields(parts);
    if (errors.length > 0) {
      els.reverseResult.innerHTML = '<div class="text-error text-sm">' +
        '<p class="font-medium mb-1">' + (window.t ? window.t('index.err_check_syntax') : '表达式格式错误，请检查语法：') + '</p>' +
        '<ul class="list-disc list-inside space-y-0.5">' +
          errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') +
        '</ul>' +
        '</div>';
      return;
    }

    // 生成自然语言释义
    var natural = toNaturalLanguage(parts);
    var fieldDetails = buildFieldDetailTable(parts);

    els.reverseResult.innerHTML =
      '<div class="mb-3">' +
        '<h4 class="text-sm font-semibold text-text-main mb-1">' + (window.t ? window.t('index.reverse_natural') : '中文释义') + '</h4>' +
        '<p class="text-base font-semibold text-success">' + natural + '</p>' +
      '</div>' +
      '<div>' +
        '<h4 class="text-sm font-semibold text-text-main mb-1">' + (window.t ? window.t('index.reverse_detail') : '字段明细') + '</h4>' +
        fieldDetails +
      '</div>';
  }

  /** 验证每个字段的语法合法性 */
  function validateFields(parts) {
    var errors = [];
    for (var i = 0; i < FIELD_DEFS.length; i++) {
      var def = FIELD_DEFS[i];
      var val = parts[i];
      var err = validateSingleField(val, def);
      if (err) {
        var fieldName = getFieldLabel(def);
        if (window.t) {
          errors.push(window.t('index.field_err_prefix', { field: fieldName, val: val, err: err }));
        } else {
          errors.push(fieldName + '字段（"' + val + '"）：' + err);
        }
      }
    }
    return errors;
  }

  function validateSingleField(val, def) {
    var _t = window.t || function(k, p) { return k; };
    var rangeStr = def.rangeStart + '-' + def.rangeEnd;

    if (val === 'L') {
      if (def.key !== 'day') return _t('index.err_L_only_day');
      return null;
    }

    var testVal = val;

    if (!/^[0-9*,/\-L]+$/.test(testVal)) {
      return _t('index.err_invalid_chars');
    }

    if (testVal.indexOf('L') > -1 && testVal !== 'L') {
      return _t('index.err_L_no_combine');
    }

    var tokens = testVal.split(',');
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (!token) return _t('index.err_empty_token');

      var slashIdx = token.indexOf('/');
      if (slashIdx > -1) {
        var before = token.substring(0, slashIdx);
        var after = token.substring(slashIdx + 1);
        var step = parseInt(after, 10);
        if (isNaN(step) || step < 1) return _t('index.err_step_positive');
        if (step > def.rangeEnd) return _t('index.err_step_range');

        if (before === '*') continue;
        if (!isValidRangeOrValue(before, def)) {
          return _t('index.err_step_base_invalid');
        }
        continue;
      }

      var dashIdx = token.indexOf('-');
      if (dashIdx > -1) {
        var startStr = token.substring(0, dashIdx);
        var endStr = token.substring(dashIdx + 1);
        var start = parseInt(startStr, 10);
        var end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end)) return _t('index.err_range_numeric');
        if (start < def.rangeStart || start > def.rangeEnd) return _t('index.err_range_start_overflow', { min: def.rangeStart, max: def.rangeEnd });
        if (end < def.rangeStart || end > def.rangeEnd) return _t('index.err_range_end_overflow', { min: def.rangeStart, max: def.rangeEnd });
        if (start > end) return _t('index.err_range_order');
        continue;
      }

      if (token === '*') continue;
      var num = parseInt(token, 10);
      if (isNaN(num)) return _t('index.err_value_numeric');
      if (num < def.rangeStart || num > def.rangeEnd) return _t('index.err_value_overflow', { val: num, min: def.rangeStart, max: def.rangeEnd });
    }
    return null;
  }

  function isValidRangeOrValue(str, def) {
    if (str === '*') return true;
    if (str.indexOf('-') > -1) {
      var rp = str.split('-');
      var s = parseInt(rp[0], 10), e = parseInt(rp[1], 10);
      return !isNaN(s) && !isNaN(e) && s >= def.rangeStart && e <= def.rangeEnd && s <= e;
    }
    var n = parseInt(str, 10);
    return !isNaN(n) && n >= def.rangeStart && n <= def.rangeEnd;
  }

  /** 生成自然语言释义（支持 i18n） */
  function toNaturalLanguage(parts) {
    var m = parts[0], h = parts[1], d = parts[2], mo = parts[3], w = parts[4];
    var _t = window.t || function(k, p) { return k; };

    if (m === '*' && h === '*' && d === '*' && mo === '*' && w === '*') {
      return _t('index.nat_every_minute_exec');
    }

    var minDesc  = describeMinute(m);
    var hourDesc = describeHour(h);
    var dayDesc  = describeDay(d);
    var weekDesc = describeWeek(w);
    var monthDesc = describeMonth(mo);

    var sentence = '';

    if (w !== '*') {
      sentence = weekDesc;
    } else if (d !== '*') {
      if (mo !== '*') {
        sentence = monthDesc + dayDesc;
      } else {
        sentence = dayDesc;
      }
    } else if (mo !== '*') {
      sentence = monthDesc + _t('index.nat_every_day');
    } else {
      sentence = _t('index.nat_every_day');
    }

    var timeStr = '';
    if (h === '*' && m === '*') {
      timeStr = '';
      if (w === '*' && d === '*' && mo === '*') {
        return _t('index.nat_every_minute_exec');
      }
    } else if (h !== '*' && m !== '*') {
      timeStr = hourDesc + ' ' + minDesc;
    } else if (h !== '*' && m === '*') {
      timeStr = hourDesc + ' ' + _t('index.nat_per_minute');
    } else if (h === '*' && m !== '*') {
      timeStr = _t('index.nat_every_hour') + ' ' + minDesc;
    }

    if (timeStr) {
      sentence += ' ' + timeStr;
    }

    return sentence + _t('index.nat_exec');
  }

  function describeMinute(val) {
    var _t = window.t || function(k) { return k; };
    return genericDescribe(val, 'minute', _t('index.nat_minute'), _t('index.nat_min'));
  }

  function describeHour(val) {
    var _t = window.t || function(k) { return k; };
    if (val === '*') return _t('index.nat_every_hour');
    return genericDescribe(val, 'hour', _t('index.nat_hour_unit'), _t('index.nat_hour_unit'));
  }

  function describeDay(val) {
    var _t = window.t || function(k) { return k; };
    if (val === '*') return _t('index.nat_every_day');
    if (val === 'L') return _t('index.nat_last_day');
    return genericDescribe(val, 'day', _t('index.nat_every_day'), _t('index.nat_every_day'));
  }

  function describeMonth(val) {
    var _t = window.t || function(k) { return k; };
    if (val === '*') return _t('index.nat_every_month');
    return genericDescribe(val, 'month', _t('index.nat_every_month'), _t('index.nat_every_month'));
  }

  function describeWeek(val) {
    var _t = window.t || function(k, p) { return k; };
    if (val === '*') return _t('index.nat_every_day');

    if (val.indexOf('-') > -1) {
      var rp = val.split('-');
      var s = parseInt(rp[0], 10), e = parseInt(rp[1], 10);
      if (!isNaN(s) && !isNaN(e) && s <= e) {
        if (s === 1 && e === 5) return _t('index.nat_every_workday');
        return _t('index.nat_weekly') + getWeekdayName(s) + _t('index.nat_to') + getWeekdayName(e);
      }
    }

    if (val.indexOf(',') > -1) {
      var items = val.split(',');
      var names = items.map(function (v) {
        var n = parseInt(v, 10);
        return getWeekdayName(n) || v;
      });
      return _t('index.nat_weekly') + names.join(', ');
    }

    var n = parseInt(val, 10);
    if (!isNaN(n)) {
      return _t('index.nat_weekly') + getWeekdayName(n);
    }

    return _t('index.nat_weekly') + val;
  }

  function genericDescribe(val, fieldKey, unitSingular, unitShort) {
    var _t = window.t || function(k, p) { return k; };
    if (val === '*') return _t('index.nat_every') + unitSingular;

    if (val.indexOf('*/') === 0) {
      var step = val.substring(2);
      return _t('index.nat_every_X', { step: step, unit: unitSingular });
    }

    var slashIdx = val.indexOf('/');
    if (slashIdx > -1) {
      var before = val.substring(0, slashIdx);
      var after = val.substring(slashIdx + 1);
      return _t('index.nat_step_from', { base: before, step: after, unit: unitSingular });
    }

    if (val.indexOf('-') > -1) {
      var rp = val.split('-');
      return _t('index.nat_range_X_to_Y', { start: rp[0], end: rp[1], unit: unitSingular });
    }

    if (val.indexOf(',') > -1) {
      return _t('index.nat_list_X', { list: val, unit: unitSingular });
    }

    var n = parseInt(val, 10);
    if (!isNaN(n)) {
      if (fieldKey === 'hour') return _t('index.nat_hour_X', { n: n });
      if (fieldKey === 'minute') return _t('index.nat_min_X', { n: n });
      return _t('index.nat_value_X', { n: n, unit: unitSingular });
    }

    return val;
  }

  /** 生成字段明细 HTML 表格（使用 Tailwind 表格样式） */
  function buildFieldDetailTable(parts) {
    var descFns = [describeMinute, describeHour, describeDay, describeMonth, describeWeek];
    var thField = window.t ? window.t('index.table_field') : '字段';
    var thRaw = window.t ? window.t('index.table_raw') : '原始值';
    var thMeaning = window.t ? window.t('index.table_meaning') : '含义';

    var rows = '';
    for (var i = 0; i < 5; i++) {
      var bg = (i % 2 === 0) ? '' : 'bg-gray-50';
      rows += '<tr class="' + bg + '">' +
                '<td class="border border-gray-200 px-3 py-1.5 text-sm">' + getFieldLabel(FIELD_DEFS[i]) + '</td>' +
                '<td class="border border-gray-200 px-3 py-1.5 text-sm"><code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono-cron text-text-main">' + escapeHTML(parts[i]) + '</code></td>' +
                '<td class="border border-gray-200 px-3 py-1.5 text-sm">' + descFns[i](parts[i]) + '</td>' +
              '</tr>';
    }

    return '<table class="w-full border-collapse border border-gray-200 text-sm">' +
             '<thead><tr class="bg-gray-50">' +
               '<th class="border border-gray-200 px-3 py-1.5 text-left text-xs font-semibold">' + thField + '</th>' +
               '<th class="border border-gray-200 px-3 py-1.5 text-left text-xs font-semibold">' + thRaw + '</th>' +
               '<th class="border border-gray-200 px-3 py-1.5 text-left text-xs font-semibold">' + thMeaning + '</th>' +
             '</tr></thead>' +
             '<tbody>' + rows + '</tbody>' +
           '</table>';
  }

  // ============================================================
  // 页面初始化
  // ============================================================

  function init() {
    cacheDom();

    // 检测是否为 Crontab 主页面：缺少关键 DOM 元素时仅初始化导航，避免报错
    if (!els.exprInput) {
      initStickyHeader();
      return;
    }

    // 模块0：导航
    initStickyHeader();

    // 模块2：生成器 UI（先构建，后续模块依赖它）
    buildGeneratorUI();

    // 模块3：预设按钮
    buildPresetButtons();

    // 模块1：复制按钮
    initCopyButton();

    // 模块4：反向解析
    initReverseParse();

    // 从 localStorage 恢复上次表达式并同步 UI
    var savedExpr = loadExpressionFromStorage();
    if (savedExpr) {
      syncGeneratorFromExpression(savedExpr);
      if (els.reverseInput) {
        els.reverseInput.value = savedExpr;
        triggerReverseParse();
      }
    } else {
      // 默认显示第一个预设（每分钟执行）
      applyPreset(PRESETS[0].expr);
    }

    // 监听语言切换事件，刷新动态生成的内容
    document.addEventListener('langchange', function () {
      var currentExpr = els.exprInput ? els.exprInput.value.trim() : '';
      // 重建生成器 UI（字段标签已更新）
      buildGeneratorUI();
      // 重建预设按钮（按钮标签保持不变，但 UI 已刷新）
      // 重新同步生成器状态
      if (currentExpr && currentExpr.split(/\s+/).length === 5) {
        syncGeneratorFromExpression(currentExpr);
      }
      // 重新触发反向解析
      if (els.reverseInput && els.reverseInput.value.trim()) {
        triggerReverseParse();
      }
    });
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
