const cheerio = require('cheerio')
const fs = require('fs')
const http = require('http')

const url = 'http://www.mca.gov.cn/article/sj/xzqh/2020/2020/202003061536.html'

const processHtml = html => {
  const $ = cheerio.load(html)
  const data = $('tr')
  const result = []
  data.each(function (item, index) {
    const value = $(this).find('td').eq(1).text().trim()
    const label = $(this).find('td').eq(2).text().trim()
    if (value && value !== '行政区划代码') {
      result.push({ value, label })
    }
  })
  return result
}

// 获取省级（省份、直辖市、自治区）数据
const getProvincesData = rowData => {
  let result = []

  rowData.forEach((item) => {
    if (item.value.substring(2, 6) === '0000') {
      result.push(item)
    }
  })

  return result
}

// 获取地级（城市）数据
const getCitiesData = rowData => {
  let provinceIndex = []
  let twoArrayIndex = []
  let twoArray = []
  let result = []

  rowData.forEach((item, index) => {
    if (item.value.substring(2, 6) === '0000') {
      provinceIndex.push(index)
    }
  })

  provinceIndex.forEach((item, index) => {
    let arr = []
    if (index !== provinceIndex.length - 1) {
      arr.push(item, provinceIndex[index + 1])
    } else {
      arr.push(item, rowData.length - 1)
    }
    twoArrayIndex.push(arr)
  })

  twoArrayIndex.forEach(item => {
    let provinceData = []
    if (item[0] === item[1]) {
      provinceData.push(rowData[item[0]])
    } else {
      provinceData = rowData.slice(item[0], item[1])
    }
    twoArray.push(provinceData)
  })

  twoArray.forEach(item => {
    let data = {}

    // 特殊情况 香港 澳门 台湾 三级目录一样
    if (item.length === 1) {
      data = {
        value: item[0].value,
        label: item[0].label,
      }
    } else {
      data = {
        value: item[0].value,
        label: item[0].label,
        children: [],
      }

      // 特殊情况直辖市
      if (item[1].value.substring(5, 6) !== '0') {
        data.children.push({
          // value: item[0].value,
          value: `${item[0].value.substring(0, 3)}100`,
          label: item[0].label,
        })
      } else {
        item.forEach((subItem, index) => {
          if (index !== 0 && subItem.value.substring(4, 6) === '00') {
            data.children.push({
              value: subItem.value,
              label: subItem.label,
            })
          }
        })
      }
    }

    result.push(data)
  })
  return result
}

// 获取县级（区县）数据
const getAreasData = rowData => {
  let provinceIndex = []
  let twoArrayIndex = []
  let twoArray = []
  let result = []

  rowData.forEach((item, index) => {
    if (item.value.substring(2, 6) === '0000') {
      provinceIndex.push(index)
    }
  })

  provinceIndex.forEach((item, index) => {
    let arr = []
    if (index !== provinceIndex.length - 1) {
      arr.push(item, provinceIndex[index + 1])
    } else {
      arr.push(item, rowData.length - 1)
    }
    twoArrayIndex.push(arr)
  })

  twoArrayIndex.forEach(item => {
    let provinceData = []
    if (item[0] === item[1]) {
      provinceData.push(rowData[item[0]])
    } else {
      provinceData = rowData.slice(item[0], item[1])
    }
    twoArray.push(provinceData)
  })

  twoArray.forEach(item => {
    let data = {}

    // 特殊情况 香港 澳门 台湾 三级目录一样
    if (item.length === 1) {
      data = {
        value: item[0].value,
        label: item[0].label,
      }
    } else {
      data = {
        value: item[0].value,
        label: item[0].label,
        children: [],
      }

      // 特殊情况直辖市
      if (item[1].value.substring(5, 6) !== '0') {
        data.children.push({
          // value: item[0].value,
          value: `${item[0].value.substring(0, 3)}100`,
          label: item[0].label,
          children: [],
        })
        item.forEach((item, index) => {
          if (index !== 0) {
            data.children[0].children.push(item)
          }
        })
      } else {
        let city = []
        item.forEach((subItem, index) => {
          if (index !== 0 && subItem.value.substring(4, 6) === '00') {
            data.children.push({
              value: subItem.value,
              label: subItem.label,
              children: []
            })
            city.push(index)
          }
        })
        // 将城市分为二维数组
        let twoArrayCity = []
        city.forEach((subItem, index) => {
          let arr = []
          if (index !== city.length - 1) {
            arr.push(subItem + 1, city[index + 1])
          } else {
            arr.push(subItem + 1, item.length)
          }
          twoArrayCity.push(arr)
        })

        twoArrayCity.forEach((subItem, index) => {
          data.children[index].children = item.slice(subItem[0], subItem[1])
        })
      }
    }

    result.push(data)
  })
  return result
}

http.get(url, res => {
  res.setEncoding('utf-8')

  let html = ''

  res.on('data', data => html += data)

  res.on('end', () => {
    const rowData = processHtml(html)

    // 创建文件夹
    if (!fs.existsSync('dist')) {
      fs.mkdir('dist', err => {
        console.log(err || '创建目录成功')
      })
    }

    // 生成原始数据
    const outputRawDataPath = './dist/data.json'
    fs.writeFile(outputRawDataPath, JSON.stringify(rowData), err => {
      console.log(err || `原始数据保存至data.json文件中${outputRawDataPath}`)
    })

    // 生成省级数据
    const provincesData = getProvincesData(rowData)
    const outputProvincesDataPath = './dist/provinces.json'
    fs.writeFile(outputProvincesDataPath, JSON.stringify(provincesData), err => {
      console.log(err || `省级数据保存至provinces.json文件中${outputProvincesDataPath}`)
    })

    // 生成地级数据
    const citiesData = getCitiesData(rowData)
    const outputCitiesDataPath = './dist/cities.json'
    fs.writeFile(outputCitiesDataPath, JSON.stringify(citiesData), err => {
      console.log(err || `地级数据保存至cities.json文件中${outputCitiesDataPath}`)
    })

    // 生成县级数据
    const areasData = getAreasData(rowData)
    const outputAreasDataPath = './dist/areas.json'
    fs.writeFile(outputAreasDataPath, JSON.stringify(areasData), err => {
      console.log(err || `县级保存成功到areas.json文件中${outputAreasDataPath}`)
    })

  })
}).on('error', e => {
  console.error(`出现错误: ${e.message}`)
})
