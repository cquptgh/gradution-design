import React from 'react'
import { Modal, Form, Input } from 'antd'

export default function CollectionCreateForm({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      title="创建项目"
      okText="创建"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="project_name"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入项目名称!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
