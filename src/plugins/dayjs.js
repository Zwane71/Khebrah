import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isYesterday from 'dayjs/plugin/isYesterday'
import isToday from 'dayjs/plugin/isToday'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(isYesterday)
dayjs.extend(isToday)
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)

export default dayjs