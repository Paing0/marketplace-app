import { Checkbox, Col, Form, Input, Row, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SquaresPlusIcon } from "@heroicons/react/24/solid";
import { sellProduct } from "../../apicalls/product";

const AddProduct = ({ setActiveTabKey }) => {
  const [form] = Form.useForm();

  const options = [
    {
      value: "clothing_and_fashion",
      label: "Clothing and Fashion",
    },
    {
      value: "electronics_and_gadgets",
      label: "Electronics and Gadgets",
    },
    {
      value: "home_and_furniture",
      label: "Home and Furniture",
    },
    {
      value: "beauty_and_personal_care",
      label: "Beauty and Personal Care",
    },
    {
      value: "books_and_media",
      label: "Books and Media",
    },
    {
      value: "sports_and_fitness",
      label: "Sports and Fitness",
    },
    {
      value: "toys_and_games",
      label: "Toys and Games",
    },
  ];

  const checkBoxOptions = [
    {
      label: "Accessories",
      value: "Accessories",
    },
    {
      label: "Warranty",
      value: "Warranty",
    },
    {
      label: "Voucher",
      value: "Voucher",
    },
  ];

  const onFinishHandler = async (values) => {
    try {
      const response = await sellProduct(values);
      if (response.isSuccess) {
        form.resetFields();
        message.success(response.message);
        setActiveTabKey("1");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <section className="my-5">
      <h1 className="text-2xl font-bold my-2">What do you want to sell?</h1>
      <Form layout="vertical" onFinish={onFinishHandler} form={form}>
        <Form.Item
          name="product_name"
          label="Product Name"
          rules={[
            {
              required: true,
              message: "Product name must be provided",
            },
          ]}
        >
          <Input placeholder="Enter product name..." />
        </Form.Item>
        <Form.Item
          name="product_description"
          label="Product Description"
          rules={[
            {
              required: true,
              message: "Description must be provided",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Enter product description..." />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="product_price"
              label="Price"
              rules={[
                {
                  required: true,
                  message: "Price must be provided",
                },
              ]}
            >
              <Input type="number" placeholder="Enter product price" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="product_category"
              label="Choose a category"
              rules={[
                {
                  required: true,
                  message: "Category must be selected",
                },
              ]}
            >
              <Select options={options} placeholder="Select a category" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="product_used_for"
              label="Used for"
              rules={[
                {
                  required: true,
                  message: "Product's usage duration must be specified",
                },
              ]}
            >
              <Input placeholder="e.g., 3 months ago" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="product_details" label="This product includes">
          <Checkbox.Group options={checkBoxOptions} />
        </Form.Item>
        <button
          type="submit"
          className="font-medium text-lg text-center py-1 rounded-md bg-blue-500 text-white flex items-center gap-2 justify-center w-full"
        >
          <SquaresPlusIcon width={20} />
          Sell
        </button>
      </Form>
    </section>
  );
};
export default AddProduct;
