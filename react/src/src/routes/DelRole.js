import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';
/*
const RoleList = ({ onDelete, roles }) => {
  const columns = [{
    title: 'Role',
    dataIndex: 'name',
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      );
    },
  }];
  return (
    <Table
      dataSource={s}
      columns={columns}
    />
  );
};

RoleList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};
*/
const RoleList = React.createClass ({
  render(){
    return(
      <div>delete role</div>
    );
  }
});
export default RoleList;