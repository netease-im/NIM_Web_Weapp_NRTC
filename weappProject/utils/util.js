const app = getApp()
/**
 * 封装toast
 */
function showToast(type, text, obj) {
  let param = { duration: (obj && obj.duration) || 1500, mask: (obj && obj.isMask) || false }
  switch (type) {
    case 'text': {
      param['title'] = text || ''
      param['icon'] = 'none'
      break
    }
    case 'loading': {
      param['title'] = text || ''
      param['icon'] = 'loading'
      break
    }
    case 'success': {
      param['title'] = text || ''
      param['icon'] = 'success'
      break
    }
    case 'error': {
      param['title'] = text || ''
      param['image'] = '/images/emoji.png'
      break
    }
    default: {
      break
    }
  }
  wx.showToast(param)
}
/**
 * 计算推拉流组件位置以及宽高
 */
function calculatePosition(newUserList, oldUserList, config) {
  config = config || {}
  let containerSize = app.globalData.videoContainerSize // 外部容器大小
  let totalCount = newUserList.length + oldUserList.length // 内部所有video的个数
  let resultUserList = oldUserList.concat(newUserList) // 返回的结果集
  const spaceWidth = 2 // 画面间的间隔
  switch (totalCount) {
    case 1: {
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width: containerSize.width,
        height: containerSize.height
      }
      break
    }
    case 2: {
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width: containerSize.width,
        height: (containerSize.height - spaceWidth) / 2
      }
      resultUserList[1].config = {
        x: 0,
        y: resultUserList[0].config.height + spaceWidth,
        width: containerSize.width,
        height: containerSize.height - resultUserList[0].config.height - spaceWidth
      }
      break
    }
    case 3: {
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width: (containerSize.width - spaceWidth) * 0.5,
        height: (containerSize.height - spaceWidth) * 0.4
      }
      resultUserList[1].config = {
        x: resultUserList[0].config.width + spaceWidth,
        y: 0,
        width: containerSize.width - resultUserList[0].config.width - spaceWidth,
        height: resultUserList[0].config.height
      }
      resultUserList[2].config = {
        x: 0,
        y: resultUserList[0].config.height + spaceWidth,
        width: containerSize.width,
        height: containerSize.height - resultUserList[0].config.height - spaceWidth
      }
      break
    }
    case 4: {
      let width = (containerSize.width - spaceWidth) / 2
      let height = (containerSize.height - spaceWidth) / 2
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: 0,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[3].config = {
        x: width + spaceWidth,
        y: height + spaceWidth,
        width,
        height
      }
      break
    }
    case 5: {
      let width = (containerSize.width - spaceWidth * 2) / 3
      let height = (containerSize.height - spaceWidth) * 0.4
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: 2 * (width + spaceWidth),
        y: 0,
        width,
        height
      }
      resultUserList[3].config = {
        x: 0,
        y: height + spaceWidth,
        width: (containerSize.width - spaceWidth) / 2,
        height: containerSize.height - height
      }
      resultUserList[4].config = {
        x: containerSize.width - spaceWidth - resultUserList[3].config.width,
        y: resultUserList[3].config.y,
        width: resultUserList[3].config.width,
        height: resultUserList[3].config.height
      }
      break
    }
    case 6: {
      let width = (containerSize.width - spaceWidth) / 2
      let height = (containerSize.height - spaceWidth * 2) / 3
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: 0,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[3].config = {
        x: width + spaceWidth,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[4].config = {
        x: 0,
        y: (height + spaceWidth)*2,
        width,
        height
      }
      resultUserList[5].config = {
        x: width + spaceWidth,
        y: resultUserList[4].config.y,
        width,
        height
      }
      break
    }
    case 7: {
      let width = (containerSize.width - spaceWidth * 2) / 3
      let height = (containerSize.height - spaceWidth * 2) / 3
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: (width + spaceWidth) * 2,
        y: 0,
        width,
        height
      }
      resultUserList[3].config = {
        x: 0,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[4].config = {
        x: width + spaceWidth,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[5].config = {
        x: resultUserList[2].config.x,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[6].config = {
        x: 0,
        y: (height + spaceWidth) * 2,
        width: containerSize.width,
        height
      }
      break
    }
    case 8: {
      let width = (containerSize.width - spaceWidth * 2) / 3
      let height = (containerSize.height - spaceWidth * 2) / 3
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: (width + spaceWidth) * 2,
        y: 0,
        width,
        height
      }
      resultUserList[3].config = {
        x: 0,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[4].config = {
        x: width + spaceWidth,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[5].config = {
        x: resultUserList[2].config.x,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[6].config = {
        x: 0,
        y: (height + spaceWidth) * 2,
        width: (containerSize.width - spaceWidth) / 2,
        height
      }
      resultUserList[7].config = {
        x: resultUserList[6].config.width + spaceWidth,
        y: (height + spaceWidth) * 2,
        width: resultUserList[6].config.width,
        height
      }
      break
    }
    case 9: {
      let width = (containerSize.width - spaceWidth * 2) / 3
      let height = (containerSize.height - spaceWidth * 2) / 3
      resultUserList[0].config = {
        x: 0,
        y: 0,
        width,
        height
      }
      resultUserList[1].config = {
        x: width + spaceWidth,
        y: 0,
        width,
        height
      }
      resultUserList[2].config = {
        x: (width + spaceWidth) * 2,
        y: 0,
        width,
        height
      }
      resultUserList[3].config = {
        x: 0,
        y: height + spaceWidth,
        width,
        height
      }
      resultUserList[4].config = {
        x: width + spaceWidth,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[5].config = {
        x: resultUserList[2].config.x,
        y: resultUserList[3].config.y,
        width,
        height
      }
      resultUserList[6].config = {
        x: 0,
        y: (height + spaceWidth) * 2,
        width,
        height
      }
      resultUserList[7].config = {
        x: resultUserList[1].config.x,
        y: resultUserList[6].config.y,
        width,
        height
      }
      resultUserList[8].config = {
        x: resultUserList[2].config.x,
        y: resultUserList[6].config.y,
        width,
        height
      }
      break
    }
  }
  return resultUserList
}

module.exports = {
  showToast,
  calculatePosition
}
