import "./styles.css";
import type {
  ActionType,
  EditableFormInstance,
  ProColumns
} from "@ant-design/pro-components";
import { EditableProTable } from "@ant-design/pro-components";

import { Button, Form, Input, Space } from "antd";
import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};
const defaultData: DataSourceType[] = new Array(5).fill(1).map((_, index) => {
  return {
    id: (Date.now() + index).toString(),
    title: `活动名称${index}`,
    decs: "这个活动真好玩",
    state: "open",
    SFNomal: 1,
    created_at: "1590486176000"
  };
});

export default function App() {
  const editableFormRef = useRef<EditableFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
    () => defaultData
  );
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "工号",
      dataIndex: "number",
      align: "center",
      formItemProps: {
        hasFeedback: false,
        rules: [
          {
            required: true,
            message: "此项是必填项"
          },
          {
            message: "只能填写8位数字",
            pattern: /^[0-9]{8}$/
          }
        ]
      },
      fieldProps: (_, { rowKey, rowIndex }) => {
        return {
          onBlur: () => {
            setTimeout(() => {
              // 每次失焦发送请求获取数据赋值给状态
              editableFormRef.current?.setRowData?.(rowKey, {
                name: "chammy"
              });
            }, 1000);
          }
        };
      }
    },
    {
      title: "名字",
      align: "center",
      dataIndex: "name",
      fieldProps: (form, { rowKey }) => {
        if (form.getFieldValue([rowKey || "", "name"])) {
          return {
            disabled: true
          };
        }
        return {};
      }
    },
    {
      title: "工种",
      align: "center",
      dataIndex: "state",
      valueType: "select",

      valueEnum: {
        open: {
          text: "正式工"
        },
        closed: {
          text: "临时工"
        }
      }
    },
    {
      title: "MOS正常工时",
      dataIndex: "nomal",
      align: "center",
      formItemProps: {
        hasFeedback: false,
        rules: [
          {
            required: true,
            message: "此项是必填项"
          },
          {
            message: "请输入[0,8]范围内的值",
            pattern: /^[0-9]{1}$/
          }
        ]
      },
      renderFormItem: (_, { isEditable }) => {
        return <Input placeholder="请输入[0,8]范围内的值" />;
      }
    },
    {
      title: "SF正常工时",
      align: "center",
      dataIndex: "SFNomal",
      renderFormItem: (_, { isEditable }) => {
        return <Input placeholder="" disabled />;
      }
    },
    {
      title: "操作",
      align: "center",
      valueType: "option",
      width: 100
    }
  ];
  return (
    <div className="App">
      <Space>
        <Button
          type="primary"
          onClick={() => {
            // actionRef.current?.addEditRecord?.(
            //   {
            //     id: (Math.random() * 1000000).toFixed(0),
            //     title: "新的一行"
            //   },
            //   { position: "top", newRecordType: "dataSource" }
            // );
          }}
          icon={<PlusOutlined />}
        >
          新建一行
        </Button>{" "}
        <Button
          type="primary"
          key="save"
          onClick={() => {
            // dataSource 就是当前数据，可以调用 api 将其保存
            console.log(dataSource);
            // 表单验证，通过后才调接口
            form.validateFields();
          }}
        >
          保存数据
        </Button>
      </Space>
      <EditableProTable<DataSourceType>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        editableFormRef={editableFormRef}
        scroll={{
          x: 960
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={false}
        toolBarRender={() => {
          return [];
        }}
        editable={{
          type: "multiple",
          editableKeys,
          form,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys
        }}
      />
    </div>
  );
}
