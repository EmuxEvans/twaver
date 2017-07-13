import { Select } from 'antd';
import RegisterForm from './RegisterForm'
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

const chooseRole = React.createClass({
  render() {
    return(
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a role"
        optionFilterProp="children"
        onChange={handleChange}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option value="system">Admin: System</Option>
        <Option value="planning">Admin: Planning</Option>
        <Option value="operation">Admin: Operation</Option>
        <Option value="resource">Admin: Resource</Option>
        <Option value="requirement">Admin: Requirement</Option>
      </Select>
    );
  }
});
export default chooseRole
