/**
 * CronBox 全局国际化 (i18n)
 * 中文 / English 双语切换，localStorage 持久化
 * 用法：HTML 元素加 data-i18n="key"，JS 中调用 t(key, params)
 */
(function () {
  'use strict';

  var LANG_KEY = 'cronbox_lang';
  var currentLang = 'zh';

  // ============================================================
  // 翻译字典
  // ============================================================
  var I18N = {
    zh: {
      // ── 导航 (Nav) ──
      'nav.json':   'JSON 格式化',
      'nav.base64': 'Base64',
      'nav.url':    'URL 编解码',
      'nav.md5':    'MD5 加密',
      'nav.yaml':   'YAML 格式化',
      'nav.xml':    'XML 格式化',
      'nav.sql':    'SQL 格式化',
      'nav.regex':  '正则测试',
      'nav.diff':   '文本对比',

      // ── 语言切换 ──
      'lang.switch': 'English',

      // ── 页脚 (Footer) ──
      'footer.about':     '关于我们',
      'footer.privacy':   '隐私政策',
      'footer.contact':   '联系我们',
      'footer.copyright': '© 2026 CronBox 免费在线工具',

      // ── 首页 (index.html) ──
      'index.title':            'Crontab 表达式',
      'index.copy':             '复制',
      'index.copied':           '已复制',
      'index.generator_title':  '可视化生成器',
      'index.generator_desc':   '为每个时间字段选择生成模式，实时组合出 Crontab 表达式',
      'index.presets_title':    '常用预设',
      'index.presets_desc':     '点击快捷按钮一键生成表达式，同时同步更新上方生成器状态',
      'index.reverse_title':    '反向解析',
      'index.reverse_desc':     '输入已有的 Crontab 表达式，实时查看中文释义',
      'index.reverse_placeholder': '例如: 30 8 * * * 或 */5 * * * *',
      'index.reverse_default':  '请输入 Crontab 表达式，自动实时解析',
      'index.guide_title':      '使用说明',
      'index.guide_structure':  'Crontab 表达式结构',
      'index.guide_structure_desc': 'Crontab 表达式由 5 个空格分隔的字段组成，从左到右依次代表：',
      'index.guide_fields':     '分钟  小时  日  月  星期',
      'index.guide_range_title': '字段取值范围',
      'index.guide_special_title': '特殊字符说明',
      'index.guide_examples_title': '常用示例',
      'index.expr_placeholder': '请通过下方生成器或预设按钮生成表达式',

      // ── 首页字段标签 ──
      'index.field_minute': '分钟',
      'index.field_hour': '小时',
      'index.field_day': '日',
      'index.field_month': '月',
      'index.field_week': '星期',
      'index.field_desc_week': '(0-7，0和7=周日)',
      // ── 首页星期名称 ──
      'index.weekday_0': '周日',
      'index.weekday_1': '周一',
      'index.weekday_2': '周二',
      'index.weekday_3': '周三',
      'index.weekday_4': '周四',
      'index.weekday_5': '周五',
      'index.weekday_6': '周六',
      // ── 首页反向解析 ──
      'index.reverse_natural': '中文释义',
      'index.reverse_detail': '字段明细',
      'index.table_field': '字段',
      'index.table_raw': '原始值',
      'index.table_meaning': '含义',
      // ── 首页错误消息 ──
      'index.err_fields_count': '表达式格式错误：需要 5 个字段（分钟 小时 日 月 星期），当前检测到 {count} 个字段',
      'index.err_check_syntax': '表达式格式错误，请检查语法：',
      'index.err_L_only_day': 'L 只能用于日字段',
      'index.err_invalid_chars': '包含非法字符',
      'index.err_L_no_combine': 'L 不能与其他值组合使用',
      'index.err_empty_token': '存在空值',
      'index.err_step_positive': '步进值必须为正整数',
      'index.err_step_range': '步进值超出范围',
      'index.err_step_base_invalid': '步进基础值不合法',
      'index.err_range_numeric': '范围值必须为数字',
      'index.err_range_start_overflow': '范围起始值超出 {min}-{max}',
      'index.err_range_end_overflow': '范围结束值超出 {min}-{max}',
      'index.err_range_order': '范围起始值不能大于结束值',
      'index.err_value_numeric': '值必须为数字或 *',
      'index.err_value_overflow': '值 {val} 超出 {min}-{max}',
      'index.field_err_prefix': '{field}字段（"{val}"）：{err}',
      // ── 首页自然语言生成 ──
      'index.nat_every_minute_exec': '每分钟执行',
      'index.nat_minute': '分钟',
      'index.nat_min': '分',
      'index.nat_hour_unit': '点',
      'index.nat_every_hour': '每小时',
      'index.nat_every_day': '每天',
      'index.nat_every_month': '每月',
      'index.nat_last_day': '最后一天',
      'index.nat_every_workday': '每个工作日',
      'index.nat_weekly': '每周',
      'index.nat_exec': ' 执行',
      'index.nat_to': '至',
      'index.nat_every': '每',
      'index.nat_per_minute': '每分钟',
      'index.nat_every_X': '每 {step} {unit}',
      'index.nat_range_X_to_Y': '{start} 到 {end} {unit}',
      'index.nat_list_X': '第 {list} {unit}',
      'index.nat_value_X': '第 {n} {unit}',
      'index.nat_hour_X': '{n}点',
      'index.nat_min_X': '{n}分',
      'index.nat_step_from': '{base}开始每 {step} {unit}',
      'index.nat_range_full': '{start} 到 {end} {unit}',

      // ── JSON 格式化 (json-formatter.html) ──
      'json.title':           'JSON 格式化校验工具',
      'json.subtitle':        '粘贴杂乱 JSON，一键格式化 / 压缩，实时语法校验',
      'json.btn_format':      '格式化',
      'json.btn_compress':    '压缩',
      'json.btn_clear':       '清空',
      'json.btn_copy':        '复制结果',
      'json.input_label':     '输入',
      'json.input_hint':      '粘贴 JSON 到此处',
      'json.output_label':    '结果',
      'json.status_waiting':  '等待输入…',
      'json.status_waiting_fmt': '等待格式化…',
      'json.status_valid':    '✅ JSON 格式正确',
      'json.status_error':    '❌ 第 {line} 行 第 {col} 列：{msg}',
      'json.status_cleared':  '已清空',
      'json.status_formatted': '✅ 已格式化',
      'json.status_compressed': '✅ 已压缩（{chars} 字符）',
      'json.status_fmt_fail': '格式化失败：JSON 不合法',
      'json.status_cmp_fail': '压缩失败：JSON 不合法',
      'json.stats_format':    '字符: {chars} | 行数: {lines}',
      'json.copy_done':       '已复制',
      'json.copy_done_raw':   '已复制原始文本',
      'json.err_unexpected':  '存在意外的字符或 JSON 提前结束，请检查括号、逗号是否匹配',
      'json.err_unterminated': '字符串缺少闭合引号',
      'json.err_number':      '数字格式不正确',
      'json.err_control':     '字符串中包含非法控制字符（如换行符），需转义为 \\n',
      'json.err_duplicate':   '对象中存在重复的 key',

      // ── Base64 (base64.html) ──
      'base64.title':      'Base64 在线编解码工具',
      'base64.subtitle':   '支持中文 / Emoji / 特殊字符 — 一键编码解码，快速互换',
      'base64.btn_encode': '编码',
      'base64.btn_decode': '解码',
      'base64.btn_swap':   '互换',
      'base64.btn_clear':  '清空',
      'base64.btn_copy':   '复制结果',
      'base64.input_label': '输入',
      'base64.input_hint':  '粘贴文本到此处',
      'base64.output_label': '结果',
      'base64.status_placeholder': '请输入文本或 Base64 字符串',
      'base64.status_encode_ok':  '✅ 编码成功',
      'base64.status_decode_ok':  '✅ 解码成功',
      'base64.status_encode_fail': '编码失败',
      'base64.status_decode_fail': '解码失败',
      'base64.status_empty_input': '请先在输入框中输入要编码的文本',
      'base64.status_empty_decode': '请先在输入框中输入要解码的 Base64 字符串',
      'base64.status_empty_swap': '输出结果为空，没有可互换的内容',
      'base64.status_swapped': '已互换，等待操作…',
      'base64.status_cleared': '已清空所有内容',
      'base64.status_copied': '已复制到剪贴板',
      'base64.status_waiting': '等待操作…',
      'base64.copy_done':   '已复制',
      'base64.stats_format': '字符: {chars} | 行数: {lines}',
      'base64.err_empty':   '输入内容为空，请输入 Base64 字符串',
      'base64.err_bad_char': '输入内容包含非 Base64 字符 "{char}"，仅允许 A-Z、a-z、0-9、+、/、=',
      'base64.err_invalid': '输入内容含有不合法字符，仅允许 A-Z、a-z、0-9、+、/、=',
      'base64.err_padding': 'Base64 填充符 "=" 只能出现在字符串末尾',
      'base64.err_length':  'Base64 字符串长度不正确，应为 4 的倍数（当前长度：{len}）',
      'base64.err_decode':  '解码失败：Base64 字符串格式不正确，无法还原为原始文本',
      'base64.msg_encode_ok':   '编码完成 — 文本已转换为 Base64 字符串',
      'base64.msg_decode_ok':   '解码完成 — Base64 已还原为原始文本',
      'base64.msg_swap_ok':     '已互换输入输出内容 — 你可以对原结果进行进一步处理',
      'base64.msg_cleared':     '已清空所有内容',
      'base64.msg_copied':      '已复制到剪贴板',
      'base64.msg_empty_output': '输出结果为空，没有可复制的内容',

      // ── URL 编解码 (url.html) ──
      'url.title':      'URL 在线编解码工具',
      'url.subtitle':   '支持中文 / 特殊字符 / 完整 URL — 一键编码解码，快速互换',
      'url.btn_encode': '编码',
      'url.btn_decode': '解码',
      'url.btn_swap':   '互换',
      'url.btn_clear':  '清空',
      'url.btn_copy':   '复制结果',
      'url.input_label': '输入',
      'url.input_hint':  '粘贴文本到此处',
      'url.output_label': '结果',
      'url.status_placeholder': '请输入文本或 URL 编码字符串',
      'url.status_encode_ok':  '✅ 编码成功',
      'url.status_decode_ok':  '✅ 解码成功',
      'url.status_encode_fail': '编码失败',
      'url.status_decode_fail': '解码失败',
      'url.status_empty_input': '请先在输入框中输入要编码的文本',
      'url.status_empty_decode': '请先在输入框中输入要解码的 URL 编码字符串',
      'url.status_empty_swap': '输出结果为空，没有可互换的内容',
      'url.status_swapped': '已互换，等待操作…',
      'url.status_cleared': '已清空所有内容',
      'url.status_copied': '已复制到剪贴板',
      'url.status_waiting': '等待操作…',
      'url.copy_done':   '已复制',
      'url.stats_format': '字符: {chars} | 行数: {lines}',
      'url.err_decode':  'URL 解码失败：字符串包含不合法的百分号编码序列（如 %ZZ），请检查后重试',
      'url.msg_encode_ok':   '编码完成 — 文本已转换为 URL 编码字符串',
      'url.msg_decode_ok':   '解码完成 — URL 编码已还原为原始文本',
      'url.msg_swap_ok':     '已互换输入输出内容 — 你可以对原结果进行进一步处理',
      'url.msg_cleared':     '已清空所有内容',
      'url.msg_copied':      '已复制到剪贴板',
      'url.msg_empty_output': '输出结果为空，没有可复制的内容',

      // ── MD5 (md5.html) ──
      'md5.title':       'MD5 在线加密工具',
      'md5.subtitle_prefix': '输入任意文本，一键生成 ',
      'md5.subtitle_32': '32 位',
      'md5.subtitle_sep': ' / ',
      'md5.subtitle_16': '16 位',
      'md5.subtitle_suffix': ' MD5 哈希值',
      'md5.btn_generate': '生成 MD5',
      'md5.btn_clear':   '清空',
      'md5.input_label': '输入文本',
      'md5.result_title': '加密结果',
      'md5.result_32_lower': '32 位 MD5（小写）',
      'md5.result_32_upper': '32 位 MD5（大写）',
      'md5.result_16_lower': '16 位 MD5（小写）',
      'md5.result_16_upper': '16 位 MD5（大写）',
      'md5.copy_btn':    '复制',
      'md5.copy_done':   '已复制',
      'md5.placeholder': '等待生成...',
      'md5.input_placeholder': '在此输入要生成 MD5 的文本内容，支持中文、emoji、多行文本...',
      'md5.stats_format': '字符: {chars} | 行数: {lines}',
      'md5.warning_title': '提示：',
      'md5.warning_text': 'MD5 是不可逆的哈希算法，无法从哈希值还原原始文本。适用于文件完整性校验、数据指纹生成等场景，不建议用于密码存储等高安全性需求。',

      // ── YAML (yaml.html) ──
      'yaml.title':       'YAML 在线格式化转换工具',
      'yaml.subtitle':    'YAML 美化 / 转 JSON / JSON 转 YAML — 适配 DevOps 配置调试场景',
      'yaml.btn_format':   '格式化',
      'yaml.btn_y2j':      'YAML→JSON',
      'yaml.btn_j2y':      'JSON→YAML',
      'yaml.btn_clear':    '清空',
      'yaml.btn_copy':     '复制结果',
      'yaml.input_label':  '输入',
      'yaml.input_hint':   'YAML / JSON',
      'yaml.output_label': '结果',
      'yaml.status_placeholder': '请输入 YAML 或 JSON 文本',
      'yaml.status_waiting': '等待操作…',
      'yaml.status_valid_yaml': '✅ YAML 格式正确',
      'yaml.status_valid_json': '✅ JSON 格式正确',
      'yaml.status_error':  '❌ 第 {line} 行：{msg}',
      'yaml.status_formatted': '✅ 已格式化',
      'yaml.status_y2j_ok': '✅ 已转为 JSON',
      'yaml.status_j2y_ok': '✅ 已转为 YAML',
      'yaml.status_fail':  '操作失败：输入内容不合法',
      'yaml.status_cleared': '已清空',
      'yaml.copy_done':    '已复制',
      'yaml.stats_format': '字符: {chars} | 行数: {lines}',
      'yaml.status_fmt_fail':   '格式化失败',
      'yaml.status_conv_fail':  '转换失败',
      'yaml.status_empty_output': '输出结果为空',
      'yaml.status_copied':     '已复制到剪贴板',
      'yaml.input_placeholder':  '在此输入 YAML 或 JSON 文本...',
      'yaml.output_placeholder': '格式化或转换结果将显示在这里...',

      // ── XML (xml.html) ──
      'xml.title':        'XML 在线格式化工具',
      'xml.subtitle':     'XML 缩进美化 / 压缩精简 / 语法校验 — 适配多层嵌套报文调试场景',
      'xml.btn_format':   '格式化',
      'xml.btn_compress': '压缩',
      'xml.btn_clear':    '清空',
      'xml.btn_copy':     '复制结果',
      'xml.input_label':  '输入',
      'xml.input_hint':   'XML',
      'xml.output_label': '结果',
      'xml.status_placeholder': '请粘贴 XML 文本',
      'xml.status_waiting': '等待操作…',
      'xml.status_valid':  '✅ XML 格式正确',
      'xml.status_error':  '❌ 第 {line} 行：{msg}',
      'xml.status_formatted': '✅ 已格式化',
      'xml.status_compressed': '✅ 已压缩（{chars} 字符）',
      'xml.status_fmt_fail': '格式化失败：XML 不合法',
      'xml.status_cmp_fail': '压缩失败：XML 不合法',
      'xml.status_cleared': '已清空',
      'xml.copy_done':    '已复制',
      'xml.stats_format': '字符: {chars} | 行数: {lines}',

      // ── SQL (sql.html) ──
      'sql.title':        'SQL 在线格式化工具',
      'sql.subtitle':     'SQL 缩进美化 / 压缩精简 / 关键字高亮 — 支持 MySQL 主流语法、建表语句、批量 SQL',
      'sql.btn_format':   '格式化',
      'sql.btn_compress': '压缩',
      'sql.btn_clear':    '清空',
      'sql.btn_copy':     '复制结果',
      'sql.input_label':  '输入',
      'sql.input_hint':   'SQL',
      'sql.output_label': '结果',
      'sql.status_placeholder': '请粘贴 SQL 语句',
      'sql.status_waiting': '等待操作…',
      'sql.status_valid':  '✅ SQL 语法可识别',
      'sql.status_formatted': '✅ 已格式化',
      'sql.status_compressed': '✅ 已压缩（{chars} 字符）',
      'sql.status_cleared': '已清空',
      'sql.copy_done':    '已复制',
      'sql.stats_format': '字符: {chars} | 行数: {lines}',

      // ── 正则测试 (regex.html) ──
      'regex.title':        '在线正则表达式测试工具',
      'regex.subtitle':     '正则匹配 / 分组提取 / 实时高亮 — 内置常用模板，支持多修饰符切换',
      'regex.label_pattern': '正则表达式',
      'regex.label_test':   '测试文本',
      'regex.btn_clear':    '清空',
      'regex.btn_copy':     '复制结果',
      'regex.flag_g': '全局匹配',
      'regex.flag_i': '忽略大小写',
      'regex.flag_m': '多行模式',
      'regex.flag_s': '单行模式',
      'regex.templates_label': '常用模板：',
      'regex.templates': ['邮箱', '手机号', 'IP 地址', '网址 URL', '身份证号', '日期', '中文字符', 'HTML 标签', '空白行', '整数'],
      'regex.result_title':  '匹配结果',
      'regex.groups_title':  '捕获分组',
      'regex.match_count':   '匹配 {count} 处',
      'regex.no_match':      '无匹配',
      'regex.error_invalid': '❌ 正则表达式有误：{msg}',
      'regex.copy_formatted': '已复制格式化结果',
      'regex.stats_format':  '字符: {chars} | 行数: {lines}',
      'regex.copy_done':    '已复制',
      'regex.status_waiting': '输入正则表达式开始测试',
      'regex.waiting_input':  '等待输入…',
      'regex.test_hint':      '在此粘贴或输入待匹配的文本内容',
      'regex.status_highlight_placeholder': '匹配结果将在此高亮显示...',
      'regex.status_invalid_regex': '正则表达式无效',
      'regex.status_correct': '✅ 正则表达式语法正确',
      'regex.status_enter_test': '请输入测试文本',
      'regex.status_no_match': '⚠️ 正则表达式正确，但无匹配结果',
      'regex.status_expr_error': '表达式错误',

      // ── 文本对比 (diff.html) ──
      'diff.title':        '在线文本对比工具',
      'diff.subtitle':     '左右分栏粘贴两段文本，自动逐行对比差异 — 适用于代码对比、配置变更、文案校对',
      'diff.btn_compare':  '对比',
      'diff.btn_clear':    '清空',
      'diff.btn_copy':     '复制结果',
      'diff.btn_swap':     '互换',
      'diff.left_label':   '原始文本（左侧）',
      'diff.right_label':  '新文本（右侧）',
      'diff.status_placeholder': '在左右两侧粘贴文本，点击「对比」查看差异',
      'diff.status_identical': '✅ 两段文本完全一致，无差异',
      'diff.status_diff':  '共 {added} 处新增、{deleted} 处删除、{changed} 处修改',
      'diff.status_too_large': '⚠️ 文本过长（超过 5000 行），仅对比前 5000 行',
      'diff.status_empty': '请在左右两侧输入文本',
      'diff.stats_format': '字符: {chars} | 行数: {lines}',
      'diff.copy_done':    '已复制差异结果',
      'diff.unified_view': '统一视图',
      'diff.side_by_side': '并排视图',
      'diff.left_hint': '旧版本 / 原始内容',
      'diff.right_hint': '新版本 / 修改后内容',
      'diff.placeholder_left': '在此粘贴原始文本（旧版本）...',
      'diff.placeholder_right': '在此粘贴修改后文本（新版本）...',
      'diff.result_title': '对比结果',
      'diff.waiting_compare': '等待对比…',
      'diff.status_waiting_result': '对比结果将在此显示...',
      'diff.status_no_content': '无内容',
      'diff.status_enter_text': '请输入文本后点击对比',
      'diff.status_identical_text': '两段文本完全相同',
      'diff.status_identical_full': '完全相同',
      'diff.status_error_compare': '对比过程出错：{msg}',
      'diff.status_cleared': '已清空',
      'diff.status_no_result_copy': '暂无对比结果可复制',
      'diff.status_copied': '已复制到剪贴板',
      'diff.result_copy_title': '文本对比结果',
      'diff.stat_added': '新增',
      'diff.stat_deleted': '删除',
      'diff.stat_unchanged': '未变',
      'diff.status_compare_result': '对比完成（{elapsed} ms）— +{added} / -{deleted} / ={equal}',

      // ── 关于我们 (about.html) ──
      'about.title':    '关于我们',
      'about.welcome':  '欢迎使用 CronBox',
      'about.welcome_text': '本网站是一个完全免费的在线工具集合，旨在帮助开发者快速完成日常开发中的各种文本处理任务。',
      'about.why_title': '为什么选择我们？',
      'about.why_1': '无需注册 — 打开即用，无需创建账号或登录',
      'about.why_2': '开箱即用 — 直观的可视化界面，无需查阅文档即可上手',
      'about.why_3': '完全免费 — 所有功能永久免费，无隐藏收费',
      'about.why_4': '本地运行 — 所有操作在您的浏览器中完成，保护您的隐私',
      'about.why_5': '专注高效 — 专注于开发者日常工具，做到极致简洁',
      'about.features_title': '主要功能',
      'about.features_1': 'JSON 格式化 / 压缩 / 语法校验',
      'about.features_2': 'Base64 / URL 编解码',
      'about.features_3': 'MD5 哈希生成',
      'about.features_4': 'YAML / XML 格式化转换',
      'about.features_5': 'SQL 格式化与高亮',
      'about.features_6': '正则表达式测试',
      'about.features_7': '文本差异对比',
      'about.audience_title': '适用人群',
      'about.audience_text': '本工具面向开发者、运维工程师、测试工程师以及任何需要进行文本处理的用户。无论您是编程新手还是资深工程师，都能在这里快速完成任务。',

      // ── 隐私政策 (privacy.html) ──
      'privacy.title':      '隐私政策',
      'privacy.updated':    '最后更新日期：2026 年 6 月 22 日',
      'privacy.collect_title': '信息收集',
      'privacy.collect_p1': '本网站不收集任何用户个人信息。您在使用 CronBox 时的所有操作均在您的本地浏览器中完成，不会向我们的服务器发送任何数据。',
      'privacy.collect_p2': '我们不会要求您注册账号、填写表单或提供任何个人身份信息。',
      'privacy.cookie_title': 'Cookie 与广告',
      'privacy.cookie_p1': '本网站使用 Google AdSense 展示广告。Google 作为第三方广告供应商，可能通过 Cookie 技术向您投放个性化广告。这些 Cookie 使 Google 及其合作伙伴能够根据您访问本网站和其他网站的情况来展示广告。',
      'privacy.cookie_types_title': 'Google AdSense 使用的 Cookie 类型',
      'privacy.cookie_type_1': 'DoubleClick Cookie：Google 及其合作伙伴用于投放基于兴趣的广告',
      'privacy.cookie_type_2': '广告个性化 Cookie：用于根据用户兴趣展示相关广告',
      'privacy.choices_title': '您的选择',
      'privacy.choices_p1': '您可以通过访问 Google 广告设置 来管理您的广告偏好或选择退出个性化广告。您也可以通过浏览器设置来管理或禁用 Cookie。',
      'privacy.choices_p2': '更多关于 Google 如何使用 Cookie 的信息，请参阅 Google 隐私政策。',
      'privacy.third_party_title': '第三方链接',
      'privacy.third_party_p1': '本网站可能包含指向第三方网站的链接。我们不对这些外部网站的隐私做法负责，建议您在访问时查阅其各自的隐私政策。',
      'privacy.update_title': '隐私政策更新',
      'privacy.update_p1': '我们可能会不时更新本隐私政策。更新后的政策将在此页面发布，并注明更新日期。建议您定期查看本页面以了解最新信息。',
      'privacy.contact_title': '联系我们',
      'privacy.contact_p1': '如果您对本隐私政策有任何疑问，请通过联系我们页面与我们取得联系。',

      // ── 联系我们 (contact.html) ──
      'contact.title':          '联系我们',
      'contact.feedback_title': '反馈与建议',
      'contact.feedback_p1':    '我们非常重视您的意见！如果您在使用过程中遇到任何问题，或有功能改进建议，欢迎通过以下方式与我们联系。',
      'contact.info_title':     '联系方式',
      'contact.email_label':    '电子邮箱：',
      'contact.info_p2':        '请在邮件中尽可能详细地描述您的问题或建议，以便我们更好地为您提供帮助。',
      'contact.what_title':     '可以反馈什么？',
      'contact.what_1': '功能建议 — 您希望增加的新功能或改进现有功能的想法',
      'contact.what_2': 'Bug 报告 — 使用中遇到的任何错误或异常行为',
      'contact.what_3': '使用体验 — 界面设计、交互流程等方面的建议',
      'contact.what_4': '文档改进 — 使用说明中不清楚或不准确的地方',
      'contact.what_5': '其他反馈 — 任何与本站相关的意见和建议',
      'contact.response_title': '响应时间',
      'contact.response_p1':    '我们通常会在 1-3 个工作日内回复您的邮件。感谢您的耐心等待！'
    },

    en: {
      // ── Nav ──
      'nav.json':   'JSON',
      'nav.base64': 'Base64',
      'nav.url':    'URL Codec',
      'nav.md5':    'MD5 Hash',
      'nav.yaml':   'YAML',
      'nav.xml':    'XML',
      'nav.sql':    'SQL',
      'nav.regex':  'Regex',
      'nav.diff':   'Diff',

      // ── Language ──
      'lang.switch': '中文',

      // ── Footer ──
      'footer.about':     'About Us',
      'footer.privacy':   'Privacy Policy',
      'footer.contact':   'Contact Us',
      'footer.copyright': '© 2026 CronBox Free Online Tools',

      // ── Index ──
      'index.title':            'Crontab Expression',
      'index.copy':             'Copy',
      'index.copied':           'Copied',
      'index.generator_title':  'Visual Generator',
      'index.generator_desc':   'Select a generation mode for each time field to compose a Crontab expression in real time',
      'index.presets_title':    'Common Presets',
      'index.presets_desc':     'Click a preset to generate the expression and sync the generator state above',
      'index.reverse_title':    'Reverse Parse',
      'index.reverse_desc':     'Enter an existing Crontab expression to see its human-readable meaning',
      'index.reverse_placeholder': 'e.g. 30 8 * * * or */5 * * * *',
      'index.reverse_default':  'Enter a Crontab expression for real-time parsing',
      'index.guide_title':      'Guide',
      'index.guide_structure':  'Crontab Expression Structure',
      'index.guide_structure_desc': 'A Crontab expression consists of 5 space-separated fields, representing from left to right:',
      'index.guide_fields':     'Minute   Hour   Day   Month   Weekday',
      'index.guide_range_title': 'Field Value Ranges',
      'index.guide_special_title': 'Special Characters',
      'index.guide_examples_title': 'Common Examples',
      'index.expr_placeholder': 'Use the generator or presets below to build an expression',

      // ── Index Field Labels ──
      'index.field_minute': 'Minute',
      'index.field_hour': 'Hour',
      'index.field_day': 'Day',
      'index.field_month': 'Month',
      'index.field_week': 'Weekday',
      'index.field_desc_week': '(0-7, 0&7=Sun)',
      // ── Index Weekday Names ──
      'index.weekday_0': 'Sun',
      'index.weekday_1': 'Mon',
      'index.weekday_2': 'Tue',
      'index.weekday_3': 'Wed',
      'index.weekday_4': 'Thu',
      'index.weekday_5': 'Fri',
      'index.weekday_6': 'Sat',
      // ── Index Reverse Parse ──
      'index.reverse_natural': 'Natural Language',
      'index.reverse_detail': 'Field Details',
      'index.table_field': 'Field',
      'index.table_raw': 'Raw Value',
      'index.table_meaning': 'Meaning',
      // ── Index Error Messages ──
      'index.err_fields_count': 'Expression format error: 5 fields required (Minute Hour Day Month Weekday), got {count} field(s)',
      'index.err_check_syntax': 'Expression format error, please check syntax:',
      'index.err_L_only_day': 'L can only be used in the Day field',
      'index.err_invalid_chars': 'Contains invalid characters',
      'index.err_L_no_combine': 'L cannot be combined with other values',
      'index.err_empty_token': 'Empty value present',
      'index.err_step_positive': 'Step value must be a positive integer',
      'index.err_step_range': 'Step value out of range',
      'index.err_step_base_invalid': 'Invalid step base value',
      'index.err_range_numeric': 'Range values must be numbers',
      'index.err_range_start_overflow': 'Range start exceeds {min}-{max}',
      'index.err_range_end_overflow': 'Range end exceeds {min}-{max}',
      'index.err_range_order': 'Range start cannot be greater than end',
      'index.err_value_numeric': 'Value must be a number or *',
      'index.err_value_overflow': 'Value {val} exceeds {min}-{max}',
      'index.field_err_prefix': '{field} ("{val}"): {err}',
      // ── Index Natural Language ──
      'index.nat_every_minute_exec': 'Every minute',
      'index.nat_minute': 'minute(s)',
      'index.nat_min': 'min',
      'index.nat_hour_unit': ':00',
      'index.nat_every_hour': 'every hour',
      'index.nat_every_day': 'every day',
      'index.nat_every_month': 'every month',
      'index.nat_last_day': 'last day',
      'index.nat_every_workday': 'every workday',
      'index.nat_weekly': 'every',
      'index.nat_exec': '',
      'index.nat_to': ' to ',
      'index.nat_every': 'every',
      'index.nat_per_minute': 'every minute',
      'index.nat_every_X': 'every {step} {unit}',
      'index.nat_range_X_to_Y': '{start} to {end} {unit}',
      'index.nat_list_X': '{list} {unit}',
      'index.nat_value_X': '{n} {unit}',
      'index.nat_hour_X': '{n}:00',
      'index.nat_min_X': 'minute {n}',
      'index.nat_step_from': 'from {base} every {step} {unit}',
      'index.nat_range_full': '{start} to {end} {unit}',

      // ── JSON ──
      'json.title':           'JSON Formatter & Validator',
      'json.subtitle':        'Paste messy JSON, format/compress with real-time syntax validation',
      'json.btn_format':      'Format',
      'json.btn_compress':    'Compress',
      'json.btn_clear':       'Clear',
      'json.btn_copy':        'Copy Result',
      'json.input_label':     'Input',
      'json.input_hint':      'Paste JSON here',
      'json.output_label':    'Output',
      'json.status_waiting':  'Waiting for input...',
      'json.status_waiting_fmt': 'Waiting for formatting...',
      'json.status_valid':    '✅ Valid JSON',
      'json.status_error':    '❌ Line {line} Col {col}: {msg}',
      'json.status_cleared':  'Cleared',
      'json.status_formatted': '✅ Formatted',
      'json.status_compressed': '✅ Compressed ({chars} chars)',
      'json.status_fmt_fail': 'Format failed: Invalid JSON',
      'json.status_cmp_fail': 'Compress failed: Invalid JSON',
      'json.stats_format':    'Chars: {chars} | Lines: {lines}',
      'json.copy_done':       'Copied',
      'json.copy_done_raw':   'Copied raw text',
      'json.err_unexpected':  'Unexpected character or premature end of JSON. Check brackets and commas.',
      'json.err_unterminated': 'Unterminated string, missing closing quote.',
      'json.err_number':      'Invalid number format.',
      'json.err_control':     'Illegal control character in string (e.g., newline), escape as \\n.',
      'json.err_duplicate':   'Duplicate key in object.',

      // ── Base64 ──
      'base64.title':      'Base64 Encoder & Decoder',
      'base64.subtitle':   'Supports Chinese / Emoji / special characters — encode and decode instantly',
      'base64.btn_encode': 'Encode',
      'base64.btn_decode': 'Decode',
      'base64.btn_swap':   'Swap',
      'base64.btn_clear':  'Clear',
      'base64.btn_copy':   'Copy Result',
      'base64.input_label': 'Input',
      'base64.input_hint':  'Paste text here',
      'base64.output_label': 'Output',
      'base64.status_placeholder': 'Enter text or Base64 string',
      'base64.status_encode_ok':  '✅ Encoded successfully',
      'base64.status_decode_ok':  '✅ Decoded successfully',
      'base64.status_encode_fail': 'Encode failed',
      'base64.status_decode_fail': 'Decode failed',
      'base64.status_empty_input': 'Please enter text to encode',
      'base64.status_empty_decode': 'Please enter a Base64 string to decode',
      'base64.status_empty_swap': 'Output is empty, nothing to swap',
      'base64.status_swapped': 'Swapped, waiting for action...',
      'base64.status_cleared': 'All cleared',
      'base64.status_copied': 'Copied to clipboard',
      'base64.status_waiting': 'Waiting for action...',
      'base64.copy_done':   'Copied',
      'base64.stats_format': 'Chars: {chars} | Lines: {lines}',
      'base64.err_empty':   'Input is empty, please enter a Base64 string',
      'base64.err_bad_char': 'Input contains non-Base64 character "{char}". Only A-Z, a-z, 0-9, +, /, = are allowed.',
      'base64.err_invalid': 'Input contains invalid characters. Only A-Z, a-z, 0-9, +, /, = are allowed.',
      'base64.err_padding': 'Base64 padding "=" must only appear at the end of the string',
      'base64.err_length':  'Invalid Base64 length, must be a multiple of 4 (current length: {len})',
      'base64.err_decode':  'Decode failed: Invalid Base64 string, cannot restore original text',
      'base64.msg_encode_ok':   'Encode complete — text converted to Base64',
      'base64.msg_decode_ok':   'Decode complete — Base64 restored to original text',
      'base64.msg_swap_ok':     'Input and output swapped — you can further process the result',
      'base64.msg_cleared':     'All content cleared',
      'base64.msg_copied':      'Copied to clipboard',
      'base64.msg_empty_output': 'Output is empty, nothing to copy',

      // ── URL ──
      'url.title':      'URL Encoder & Decoder',
      'url.subtitle':   'Supports Chinese / special characters / full URLs — encode and decode instantly',
      'url.btn_encode': 'Encode',
      'url.btn_decode': 'Decode',
      'url.btn_swap':   'Swap',
      'url.btn_clear':  'Clear',
      'url.btn_copy':   'Copy Result',
      'url.input_label': 'Input',
      'url.input_hint':  'Paste text here',
      'url.output_label': 'Output',
      'url.status_placeholder': 'Enter text or URL-encoded string',
      'url.status_encode_ok':  '✅ Encoded successfully',
      'url.status_decode_ok':  '✅ Decoded successfully',
      'url.status_encode_fail': 'Encode failed',
      'url.status_decode_fail': 'Decode failed',
      'url.status_empty_input': 'Please enter text to encode',
      'url.status_empty_decode': 'Please enter a URL-encoded string to decode',
      'url.status_empty_swap': 'Output is empty, nothing to swap',
      'url.status_swapped': 'Swapped, waiting for action...',
      'url.status_cleared': 'All cleared',
      'url.status_copied': 'Copied to clipboard',
      'url.status_waiting': 'Waiting for action...',
      'url.copy_done':   'Copied',
      'url.stats_format': 'Chars: {chars} | Lines: {lines}',
      'url.err_decode':  'URL decode failed: string contains invalid percent-encoding (e.g. %ZZ), please check and retry',
      'url.msg_encode_ok':   'Encode complete — text converted to URL-encoded string',
      'url.msg_decode_ok':   'Decode complete — URL-encoding restored to original text',
      'url.msg_swap_ok':     'Input and output swapped — you can further process the result',
      'url.msg_cleared':     'All content cleared',
      'url.msg_copied':      'Copied to clipboard',
      'url.msg_empty_output': 'Output is empty, nothing to copy',

      // ── MD5 ──
      'md5.title':       'MD5 Hash Generator',
      'md5.subtitle_prefix': 'Enter any text to generate ',
      'md5.subtitle_32': '32-bit',
      'md5.subtitle_sep': ' / ',
      'md5.subtitle_16': '16-bit',
      'md5.subtitle_suffix': ' MD5 hashes',
      'md5.btn_generate': 'Generate MD5',
      'md5.btn_clear':   'Clear',
      'md5.input_label': 'Input Text',
      'md5.result_title': 'Hash Results',
      'md5.result_32_lower': '32-bit MD5 (lowercase)',
      'md5.result_32_upper': '32-bit MD5 (uppercase)',
      'md5.result_16_lower': '16-bit MD5 (lowercase)',
      'md5.result_16_upper': '16-bit MD5 (uppercase)',
      'md5.copy_btn':    'Copy',
      'md5.copy_done':   'Copied',
      'md5.placeholder': 'Waiting...',
      'md5.input_placeholder': 'Enter text to generate MD5 hash. Supports Chinese, emoji, multi-line text...',
      'md5.stats_format': 'Chars: {chars} | Lines: {lines}',
      'md5.warning_title': 'Note: ',
      'md5.warning_text': 'MD5 is an irreversible hash algorithm. Hashes cannot be restored to original text. Suitable for file integrity checks and data fingerprinting. Not recommended for password storage or other high-security needs.',

      // ── YAML ──
      'yaml.title':       'YAML Formatter & Converter',
      'yaml.subtitle':    'YAML format / to JSON / from JSON — for DevOps config debugging',
      'yaml.btn_format':   'Format',
      'yaml.btn_y2j':      'YAML→JSON',
      'yaml.btn_j2y':      'JSON→YAML',
      'yaml.btn_clear':    'Clear',
      'yaml.btn_copy':     'Copy Result',
      'yaml.input_label':  'Input',
      'yaml.input_hint':   'YAML / JSON',
      'yaml.output_label': 'Output',
      'yaml.status_placeholder': 'Enter YAML or JSON text',
      'yaml.status_waiting': 'Waiting for action...',
      'yaml.status_valid_yaml': '✅ Valid YAML',
      'yaml.status_valid_json': '✅ Valid JSON',
      'yaml.status_error':  '❌ Line {line}: {msg}',
      'yaml.status_formatted': '✅ Formatted',
      'yaml.status_y2j_ok': '✅ Converted to JSON',
      'yaml.status_j2y_ok': '✅ Converted to YAML',
      'yaml.status_fail':  'Operation failed: Invalid input',
      'yaml.status_cleared': 'Cleared',
      'yaml.copy_done':    'Copied',
      'yaml.stats_format': 'Chars: {chars} | Lines: {lines}',
      'yaml.status_fmt_fail':   'Format failed',
      'yaml.status_conv_fail':  'Conversion failed',
      'yaml.status_empty_output': 'Output is empty',
      'yaml.status_copied':     'Copied to clipboard',
      'yaml.input_placeholder':  'Enter YAML or JSON text here...',
      'yaml.output_placeholder': 'Formatted or converted results will appear here...',

      // ── XML ──
      'xml.title':        'XML Formatter',
      'xml.subtitle':     'XML indent / compress / validate — for nested message debugging',
      'xml.btn_format':   'Format',
      'xml.btn_compress': 'Compress',
      'xml.btn_clear':    'Clear',
      'xml.btn_copy':     'Copy Result',
      'xml.input_label':  'Input',
      'xml.input_hint':   'XML',
      'xml.output_label': 'Output',
      'xml.status_placeholder': 'Paste XML text',
      'xml.status_waiting': 'Waiting for action...',
      'xml.status_valid':  '✅ Valid XML',
      'xml.status_error':  '❌ Line {line}: {msg}',
      'xml.status_formatted': '✅ Formatted',
      'xml.status_compressed': '✅ Compressed ({chars} chars)',
      'xml.status_fmt_fail': 'Format failed: Invalid XML',
      'xml.status_cmp_fail': 'Compress failed: Invalid XML',
      'xml.status_cleared': 'Cleared',
      'xml.copy_done':    'Copied',
      'xml.stats_format': 'Chars: {chars} | Lines: {lines}',

      // ── SQL ──
      'sql.title':        'SQL Formatter',
      'sql.subtitle':     'SQL indent / compress / keyword highlight — supports MySQL syntax, DDL, batch SQL',
      'sql.btn_format':   'Format',
      'sql.btn_compress': 'Compress',
      'sql.btn_clear':    'Clear',
      'sql.btn_copy':     'Copy Result',
      'sql.input_label':  'Input',
      'sql.input_hint':   'SQL',
      'sql.output_label': 'Output',
      'sql.status_placeholder': 'Paste SQL statement',
      'sql.status_waiting': 'Waiting for action...',
      'sql.status_valid':  '✅ Valid SQL syntax',
      'sql.status_formatted': '✅ Formatted',
      'sql.status_compressed': '✅ Compressed ({chars} chars)',
      'sql.status_cleared': 'Cleared',
      'sql.copy_done':    'Copied',
      'sql.stats_format': 'Chars: {chars} | Lines: {lines}',

      // ── Regex ──
      'regex.title':        'Online Regex Tester',
      'regex.subtitle':     'Match / groups / real-time highlight — built-in templates, multi-flag support',
      'regex.label_pattern': 'Pattern',
      'regex.label_test':   'Test Text',
      'regex.btn_clear':    'Clear',
      'regex.btn_copy':     'Copy Result',
      'regex.flag_g': 'Global',
      'regex.flag_i': 'Ignore Case',
      'regex.flag_m': 'Multiline',
      'regex.flag_s': 'Dotall',
      'regex.templates_label': 'Templates: ',
      'regex.templates': ['Email', 'Phone', 'IP Address', 'URL', 'ID Number', 'Date', 'Chinese Chars', 'HTML Tags', 'Blank Lines', 'Integer'],
      'regex.result_title':  'Match Results',
      'regex.groups_title':  'Capture Groups',
      'regex.match_count':   '{count} match(es)',
      'regex.no_match':      'No match',
      'regex.error_invalid': '❌ Invalid regex: {msg}',
      'regex.copy_formatted': 'Copied formatted result',
      'regex.stats_format':  'Chars: {chars} | Lines: {lines}',
      'regex.copy_done':    'Copied',
      'regex.status_waiting': 'Enter a regex pattern to start testing',
      'regex.waiting_input':  'Waiting for input...',
      'regex.test_hint':      'Paste or type the text to match against here',
      'regex.status_highlight_placeholder': 'Match results will be highlighted here...',
      'regex.status_invalid_regex': 'Invalid regex',
      'regex.status_correct': '✅ Valid regex syntax',
      'regex.status_enter_test': 'Please enter test text',
      'regex.status_no_match': '⚠️ Valid regex, but no matches found',
      'regex.status_expr_error': 'Expression error',

      // ── Diff ──
      'diff.title':        'Text Diff Tool',
      'diff.subtitle':     'Paste two texts side by side, auto line-by-line diff — for code review, config changes, copy editing',
      'diff.btn_compare':  'Compare',
      'diff.btn_clear':    'Clear',
      'diff.btn_copy':     'Copy Result',
      'diff.btn_swap':     'Swap',
      'diff.left_label':   'Original (Left)',
      'diff.right_label':  'New (Right)',
      'diff.status_placeholder': 'Paste text on both sides and click Compare to see differences',
      'diff.status_identical': '✅ Texts are identical, no differences found',
      'diff.status_diff':  '{added} added, {deleted} deleted, {changed} changed',
      'diff.status_too_large': '⚠️ Text too long (over 5000 lines), showing first 5000 lines only',
      'diff.status_empty': 'Please enter text on both sides',
      'diff.stats_format': 'Chars: {chars} | Lines: {lines}',
      'diff.copy_done':    'Diff result copied',
      'diff.unified_view': 'Unified View',
      'diff.side_by_side': 'Side by Side',
      'diff.left_hint': 'Old version / Original content',
      'diff.right_hint': 'New version / Modified content',
      'diff.placeholder_left': 'Paste original text (old version) here...',
      'diff.placeholder_right': 'Paste modified text (new version) here...',
      'diff.result_title': 'Diff Results',
      'diff.waiting_compare': 'Waiting for comparison...',
      'diff.status_waiting_result': 'Diff results will appear here...',
      'diff.status_no_content': 'No content',
      'diff.status_enter_text': 'Please enter text and click Compare',
      'diff.status_identical_text': 'The two texts are identical',
      'diff.status_identical_full': 'Identical',
      'diff.status_error_compare': 'Comparison error: {msg}',
      'diff.status_cleared': 'Cleared',
      'diff.status_no_result_copy': 'No results to copy',
      'diff.status_copied': 'Copied to clipboard',
      'diff.result_copy_title': 'Text Diff Results',
      'diff.stat_added': 'Added',
      'diff.stat_deleted': 'Deleted',
      'diff.stat_unchanged': 'Unchanged',
      'diff.status_compare_result': 'Comparison complete ({elapsed} ms) — +{added} / -{deleted} / ={equal}',

      // ── About ──
      'about.title':    'About Us',
      'about.welcome':  'Welcome to CronBox',
      'about.welcome_text': 'CronBox is a completely free collection of online tools designed to help developers quickly accomplish everyday text processing tasks.',
      'about.why_title': 'Why Choose Us?',
      'about.why_1': 'No Registration — open and use immediately, no account needed',
      'about.why_2': 'Ready to Use — intuitive visual interface, no documentation required',
      'about.why_3': 'Completely Free — all features are permanently free, no hidden charges',
      'about.why_4': 'Local Processing — all operations run in your browser, protecting your privacy',
      'about.why_5': 'Focused & Efficient — dedicated to developer tools, kept extremely simple',
      'about.features_title': 'Key Features',
      'about.features_1': 'JSON format / compress / validate',
      'about.features_2': 'Base64 / URL encode & decode',
      'about.features_3': 'MD5 hash generation',
      'about.features_4': 'YAML / XML format & convert',
      'about.features_5': 'SQL format & highlight',
      'about.features_6': 'Regular expression testing',
      'about.features_7': 'Text diff comparison',
      'about.audience_title': 'Who Is This For?',
      'about.audience_text': 'This tool is for developers, DevOps engineers, QA engineers, and anyone who needs text processing. Whether you are a beginner or a senior engineer, you can get things done quickly here.',

      // ── Privacy ──
      'privacy.title':      'Privacy Policy',
      'privacy.updated':    'Last updated: June 22, 2026',
      'privacy.collect_title': 'Information Collection',
      'privacy.collect_p1': 'This website does not collect any personal user information. All operations you perform on CronBox are completed locally in your browser and no data is sent to our servers.',
      'privacy.collect_p2': 'We do not require you to register an account, fill out forms, or provide any personally identifiable information.',
      'privacy.cookie_title': 'Cookies & Advertising',
      'privacy.cookie_p1': 'This website uses Google AdSense to display advertisements. Google, as a third-party ad vendor, may use cookies to serve personalized ads. These cookies enable Google and its partners to serve ads based on your visits to this site and other websites.',
      'privacy.cookie_types_title': 'Cookie Types Used by Google AdSense',
      'privacy.cookie_type_1': 'DoubleClick Cookie: Used by Google and its partners to serve interest-based ads',
      'privacy.cookie_type_2': 'Ad Personalization Cookie: Used to display relevant ads based on user interests',
      'privacy.choices_title': 'Your Choices',
      'privacy.choices_p1': 'You can manage your ad preferences or opt out of personalized ads by visiting Google Ads Settings. You can also manage or disable cookies through your browser settings.',
      'privacy.choices_p2': 'For more information on how Google uses cookies, please see the Google Privacy Policy.',
      'privacy.third_party_title': 'Third-Party Links',
      'privacy.third_party_p1': 'This website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and recommend reviewing their respective privacy policies when visiting.',
      'privacy.update_title': 'Privacy Policy Updates',
      'privacy.update_p1': 'We may update this privacy policy from time to time. Updated policies will be posted on this page with the revision date noted. We recommend checking this page periodically for the latest information.',
      'privacy.contact_title': 'Contact Us',
      'privacy.contact_p1': 'If you have any questions about this privacy policy, please contact us through our Contact Us page.',

      // ── Contact ──
      'contact.title':          'Contact Us',
      'contact.feedback_title': 'Feedback & Suggestions',
      'contact.feedback_p1':    'We value your feedback! If you encounter any issues or have feature suggestions, feel free to reach out to us.',
      'contact.info_title':     'Contact Information',
      'contact.email_label':    'Email: ',
      'contact.info_p2':        'Please describe your issue or suggestion in as much detail as possible so we can better assist you.',
      'contact.what_title':     'What Can You Feedback?',
      'contact.what_1': 'Feature Suggestions — new features you would like to see or improvements to existing ones',
      'contact.what_2': 'Bug Reports — any errors or unexpected behavior encountered',
      'contact.what_3': 'User Experience — suggestions on interface design, interaction flow, etc.',
      'contact.what_4': 'Documentation — unclear or inaccurate parts of the documentation',
      'contact.what_5': 'Other Feedback — any comments or suggestions related to this site',
      'contact.response_title': 'Response Time',
      'contact.response_p1':    'We typically respond to emails within 1-3 business days. Thank you for your patience!'
    }
  };

  // ============================================================
  // 公共 API
  // ============================================================

  /** 获取翻译文本，支持 {key} 占位替换 */
  function t(key, params) {
    var dict = I18N[currentLang] || I18N['zh'];
    var text = dict[key];
    if (text === undefined) return key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
    }
    return text;
  }

  /** 遍历所有 [data-i18n] 元素，更新其文本内容 */
  function applyTranslations() {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    }
    // 也处理 placeholder
    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var pel = placeholders[j];
      var pkey = pel.getAttribute('data-i18n-placeholder');
      if (pkey) {
        pel.setAttribute('placeholder', t(pkey));
      }
    }
  }

  /** 切换语言 */
  function setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    var titleKey = document.documentElement.getAttribute('data-i18n-title') || 'index.title';
    document.title = t(titleKey) + ' - CronBox';
    applyTranslations();
    // 触发自定义事件，让各页面监听并刷新动态内容
    if (typeof CustomEvent !== 'undefined') {
      try { document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } })); } catch (e) {}
    }
  }

  /** 初始化语言切换按钮 */
  function initLangToggle() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.textContent = t('lang.switch');
    btn.addEventListener('click', function () {
      setLanguage(currentLang === 'zh' ? 'en' : 'zh');
    });
  }

  /** 初始化 */
  function init() {
    // 检查是否强制指定语言（用于独立中/英文 SEO 页面）
    var forcedLang = document.documentElement.getAttribute('data-force-lang');
    if (forcedLang === 'en' || forcedLang === 'zh') {
      currentLang = forcedLang;
    } else {
      // 读取保存的语言偏好
      try {
        var saved = localStorage.getItem(LANG_KEY);
        if (saved === 'en' || saved === 'zh') {
          currentLang = saved;
        }
      } catch (e) {}
    }

    // 应用初始语言
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN';
    applyTranslations();

    // 仅在非强制语言模式下初始化切换按钮（强制模式使用页面跳转）
    if (!forcedLang) {
      initLangToggle();
    }

    // 暴露到全局
    window.setLanguage = setLanguage;
    window.t = t;
    window.getCurrentLang = function () { return currentLang; };

    // ============================================================
    // Toast 通知系统
    // ============================================================
    var toastContainer = null;

    function getToastContainer() {
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
      }
      return toastContainer;
    }

    /**
     * 显示轻量 Toast 通知，2 秒后自动消失
     * @param {string} message - 提示文本
     * @param {string} type - 'success' | 'error' | 'warning' | 'info'
     */
    function showToast(message, type) {
      type = type || 'info';
      var icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
      var cls = 'toast-' + (type === 'error' ? 'error' : type === 'warning' ? 'warning' :
                            type === 'success' ? 'success' : 'info');

      var item = document.createElement('div');
      item.className = 'toast-item ' + cls;
      item.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
                       '<span>' + message + '</span>';

      getToastContainer().appendChild(item);

      // 2 秒后移除（animation toastOut 在 1.7s 触发，再等 0.3s 完成）
      setTimeout(function () {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 2100);
    }

    window.showToast = showToast;

    // ============================================================
    // 全局键盘快捷键：Ctrl+S 复制结果
    // 在所有工具页中，Ctrl+S 会触发「复制结果」按钮点击
    // ============================================================
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // 仅在用户聚焦在输入区域时触发（防止与浏览器保存页面冲突）
        var activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
          e.preventDefault();
          // 尝试查找页面中的复制按钮
          var copyBtn = document.getElementById('btn-copy');
          if (copyBtn) {
            copyBtn.click();
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
