import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Header, Modal } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";

function ProductAttributes({ description, _id, isNonUser }) {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    const url = `${baseUrl}/api/product`;

    const payload = { params: { _id } };

    await axios.delete(url, payload);

    router.push("/");
  };

  return (
    <>
      <Header as="h3">About this product </Header>
      <p>{description}</p>
      {isNonUser && (
        <Button
          onClick={() => setModalOpen(true)}
          icon="trash alternate outline"
          color="red"
          content="Delete Product"
        />
      )}
      <Modal open={modalOpen} dimmer="blurring">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={() => setModalOpen(false)} />
          <Button
            onClick={handleDelete}
            negative
            icon="trash"
            labelPosition="right"
            content="Delete"
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ProductAttributes;
