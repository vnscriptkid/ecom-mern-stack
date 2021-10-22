import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Header,
  Icon,
  Input,
  TextArea,
  Image,
  Message,
} from "semantic-ui-react";
import axios from "axios";

import baseUrl from "../utils/baseUrl";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: "",
};

function CreateProduct() {
  const [product, setProduct] = useState(INITIAL_PRODUCT);

  const [mediaPreview, setMediaPreview] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allValid, setAllValid] = useState(false);

  useEffect(() => {
    const validated = Object.values(product).every((value) => Boolean(value));

    setAllValid(validated);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setProduct((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mediaUrl = await handleImageUpload();

    const { description, name, price } = product;

    const payload = { name, description, price, mediaUrl };

    await axios.post(`${baseUrl}/api/product`, payload);

    setSuccess(true);
    setLoading(false);
    setProduct(INITIAL_PRODUCT);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();

    formData.append("file", product.media);
    formData.append("upload_preset", "reactreserve");
    formData.append("cloud_name", "vnscriptkid");

    const res = await axios.post(process.env.CLOUDINARY_URL, formData);

    return res.data.url;
  };

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form loading={loading} success={success} onSubmit={handleSubmit}>
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            onChange={handleChange}
            value={product.name}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            type="number"
            min="0.00"
            step="0.01"
            onChange={handleChange}
            value={product.price}
          />
          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
          disabled={!allValid || loading}
        />
      </Form>
    </>
  );
}

export default CreateProduct;
