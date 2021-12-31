import React from 'react'
import { Cascader } from 'antd'
import logo from './logo.svg'
import './App.less'
import provinces from './datas/provinces.json'
import cities from './datas/cities.json'
import areas from './datas/areas.json'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Ant Design 省市区三级联动示例</p>
        <Cascader
          style={{ marginBottom: 16 }}
          placeholder='省级数据'
          options={provinces}
        />
        <Cascader
          style={{ marginBottom: 16 }}
          placeholder='省市二级联动'
          options={cities}
        />
        <Cascader
          style={{ marginBottom: 16 }}
          placeholder='省市区三级联动'
          options={areas}
        />
      </header>
    </div>
  )
}

export default App
