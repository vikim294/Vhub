// 将 秒数 转换为 时分秒
export const durationFormat = (totalSecond) => {
  const h = parseInt(totalSecond / 60 / 60 % 60)
  const m = parseInt(totalSecond / 60 % 60)
  const s = parseInt(totalSecond % 60)

  // h = h < 10 ? '0' + h : h
  // m = m < 10 ? '0' + m : m
  // s = s < 10 ? '0' + s : s

  if (h === 0) {
    return `${m}:${s}`
  } else {
    return `${h}:${m}:${s}`
  }
}
