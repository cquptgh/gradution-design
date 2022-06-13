import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Input, Space } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import { delPoint, setAsCenterPoint } from '@/redux/actions/selectPoint'
import './index.css'

//展示选取配送点的组件
function PointDisplay(props) {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef()
  const { selectPoint, setAsCenterPoint } = props

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={'搜索配送点'}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            筛选
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100)
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns = [
    {
      title: '服务点',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: '是否为中心点',
      dataIndex: 'is_center',
      key: 'is_center',
      filters: [
        {
          text: '是',
          value: 1
        },
        {
          text: '否',
          value: 0
        }
      ],
      onFilter: (value, record) => record.is_center === value,
      filterMultiple: false,
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <>
          <Button
            onClick={() => setAsCenterPoint(record.key)}
            disabled={record.is_center === 1 ? true : false}
          >
            设为中心点
          </Button>
          <Button
            onClick={() => deletePoint(record)}
            disabled={record.is_center === 1 ? true : false}
            danger
          >
            删除
          </Button>
        </>
      )
    }
  ]

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }

  const deletePoint = record => {
    const { labelsLayer, delPoint } = props
    labelsLayer.remove(record.marker)
    delPoint(record.key)
  }

  return (
    <Table
      columns={columns}
      dataSource={selectPoint}
      rowKey={record => record.key}
      pagination={false}
      scroll={{ y: 272 }}
      className="point-display-table"
    />
  )
}

export default connect(
  state => ({
    selectPoint: state.selectPoint
  }),
  {
    delPoint,
    setAsCenterPoint
  }
)(PointDisplay)
