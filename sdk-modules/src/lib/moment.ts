// 处理 Moment 国际化，直接包含需要的语言原文，减少rollup打包体积
import moment from 'moment';

const locales = {
  'zh-ch': {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
      '_'
    ),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
      '_'
    ),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY年M月D日',
      LLL: 'YYYY年M月D日Ah点mm分',
      LLLL: 'YYYY年M月D日ddddAh点mm分',
      l: 'YYYY/M/D',
      ll: 'YYYY年M月D日',
      lll: 'YYYY年M月D日 HH:mm',
      llll: 'YYYY年M月D日dddd HH:mm',
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
        hour = 0;
      }
      if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
        return hour;
      } else if (meridiem === '下午' || meridiem === '晚上') {
        return hour + 12;
      } else {
        // '中午'
        return hour >= 11 ? hour : hour + 12;
      }
    },
    meridiem: function (hour, minute, isLower) {
      var hm = hour * 100 + minute;
      if (hm < 600) {
        return '凌晨';
      } else if (hm < 900) {
        return '早上';
      } else if (hm < 1130) {
        return '上午';
      } else if (hm < 1230) {
        return '中午';
      } else if (hm < 1800) {
        return '下午';
      } else {
        return '晚上';
      }
    },
    calendar: {
      sameDay: '[今天]LT',
      nextDay: '[明天]LT',
      nextWeek: function (now) {
        if (now.week() !== (this as any).week()) {
          return '[下]dddLT';
        } else {
          return '[本]dddLT';
        }
      },
      lastDay: '[昨天]LT',
      lastWeek: function (now) {
        if ((this as any).week() !== now.week()) {
          return '[上]dddLT';
        } else {
          return '[本]dddLT';
        }
      },
      sameElse: 'L',
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日';
        case 'M':
          return number + '月';
        case 'w':
        case 'W':
          return number + '周';
        default:
          return number;
      }
    },
    relativeTime: {
      future: '%s后',
      past: '%s前',
      s: '几秒',
      ss: '%d 秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      w: '1 周',
      ww: '%d 周',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年',
    },
    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
    },
  },
  'ja': {
    eras: [
      {
        since: '2019-05-01',
        offset: 1,
        name: '令和',
        narrow: '㋿',
        abbr: 'R',
      },
      {
        since: '1989-01-08',
        until: '2019-04-30',
        offset: 1,
        name: '平成',
        narrow: '㍻',
        abbr: 'H',
      },
      {
        since: '1926-12-25',
        until: '1989-01-07',
        offset: 1,
        name: '昭和',
        narrow: '㍼',
        abbr: 'S',
      },
      {
        since: '1912-07-30',
        until: '1926-12-24',
        offset: 1,
        name: '大正',
        narrow: '㍽',
        abbr: 'T',
      },
      {
        since: '1873-01-01',
        until: '1912-07-29',
        offset: 6,
        name: '明治',
        narrow: '㍾',
        abbr: 'M',
      },
      {
        since: '0001-01-01',
        until: '1873-12-31',
        offset: 1,
        name: '西暦',
        narrow: 'AD',
        abbr: 'AD',
      },
      {
        since: '0000-12-31',
        until: -Infinity,
        offset: 1,
        name: '紀元前',
        narrow: 'BC',
        abbr: 'BC',
      },
    ],
    eraYearOrdinalRegex: /(元|\d+)年/,
    eraYearOrdinalParse: function (input, match) {
      return match[1] === '元' ? 1 : parseInt(match[1] || input, 10);
    },
    months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
      '_'
    ),
    weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY年M月D日',
      LLL: 'YYYY年M月D日 HH:mm',
      LLLL: 'YYYY年M月D日 dddd HH:mm',
      l: 'YYYY/MM/DD',
      ll: 'YYYY年M月D日',
      lll: 'YYYY年M月D日 HH:mm',
      llll: 'YYYY年M月D日(ddd) HH:mm',
    },
    meridiemParse: /午前|午後/i,
    isPM: function (input) {
      return input === '午後';
    },
    meridiem: function (hour, minute, isLower) {
      if (hour < 12) {
        return '午前';
      } else {
        return '午後';
      }
    },
    calendar: {
      sameDay: '[今日] LT',
      nextDay: '[明日] LT',
      nextWeek: function (now) {
        if (now.week() !== (this as any).week()) {
          return '[来週]dddd LT';
        } else {
          return 'dddd LT';
        }
      },
      lastDay: '[昨日] LT',
      lastWeek: function (now) {
        if ((this as any).week() !== now.week()) {
          return '[先週]dddd LT';
        } else {
          return 'dddd LT';
        }
      },
      sameElse: 'L',
    },
    dayOfMonthOrdinalParse: /\d{1,2}日/,
    ordinal: function (number, period) {
      switch (period) {
        case 'y':
          return number === 1 ? '元年' : number + '年';
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日';
        default:
          return number;
      }
    },
    relativeTime: {
      future: '%s後',
      past: '%s前',
      s: '数秒',
      ss: '%d秒',
      m: '1分',
      mm: '%d分',
      h: '1時間',
      hh: '%d時間',
      d: '1日',
      dd: '%d日',
      M: '1ヶ月',
      MM: '%dヶ月',
      y: '1年',
      yy: '%d年',
    },
  },
  'ko': {
    months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split(
      '_'
    ),
    weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
    weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
    longDateFormat: {
      LT: 'A h:mm',
      LTS: 'A h:mm:ss',
      L: 'YYYY.MM.DD.',
      LL: 'YYYY년 MMMM D일',
      LLL: 'YYYY년 MMMM D일 A h:mm',
      LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
      l: 'YYYY.MM.DD.',
      ll: 'YYYY년 MMMM D일',
      lll: 'YYYY년 MMMM D일 A h:mm',
      llll: 'YYYY년 MMMM D일 dddd A h:mm',
    },
    calendar: {
      sameDay: '오늘 LT',
      nextDay: '내일 LT',
      nextWeek: 'dddd LT',
      lastDay: '어제 LT',
      lastWeek: '지난주 dddd LT',
      sameElse: 'L',
    },
    relativeTime: {
      future: '%s 후',
      past: '%s 전',
      s: '몇 초',
      ss: '%d초',
      m: '1분',
      mm: '%d분',
      h: '한 시간',
      hh: '%d시간',
      d: '하루',
      dd: '%d일',
      M: '한 달',
      MM: '%d달',
      y: '일 년',
      yy: '%d년',
    },
    dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
    ordinal: function (number, period) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '일';
        case 'M':
          return number + '월';
        case 'w':
        case 'W':
          return number + '주';
        default:
          return number;
      }
    },
    meridiemParse: /오전|오후/,
    isPM: function (token) {
      return token === '오후';
    },
    meridiem: function (hour, minute, isUpper) {
      return hour < 12 ? '오전' : '오후';
    },
  }
}

moment.defineLocale('zh-cn', locales['zh-ch'] as any);
moment.defineLocale('ja', locales['ja'] as any);
moment.defineLocale('ko', locales['ko'] as any);

export { moment }
export default moment
