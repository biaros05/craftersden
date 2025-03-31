import React, { useState } from "react";
import Link from "./Navigation/Link";
import '../styles/footer.css'
import { Anchor, Modal, Stack, Select, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from "../hooks/useAuth";
import { errorMessage, successMessage } from "../utils/notification_utils";
import MinecraftButton from "./Custom/MinecraftButton";


/**
 * @returns {React.ReactNode} - Footer component
 */
export default function Footer(): React.ReactNode {
  const {id} = useAuth() ?? {};
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    feedback: '',
    type: ''
  });

  /**
   *This function handle's the user feedback submission and sends it to the db with
   *the form data
   * @returns {Function} - The error message pop up with message
   */
  async function handleSubmit(){
    const data = {
      author: id,
      type: formData.type,
      message: formData.feedback
    };

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    const response = await fetch('/api/feedback/', requestOptions);
    const json = await response.json();

    if(!response.ok){
      return errorMessage(json.message);
    }

    successMessage(json.message);
    setFormData({feedback: '', type: ''});
  }
  return <footer className="footer-container">
    <section className="site-footer">
      <ul className="footer-links">
        <h3>Site</h3>
        <li><Link to='/' state={{ canGoBack: true }}>Welcome</Link></li>
        <li><Link to='/den' state={{ canGoBack: true }}>Den</Link></li>
        <li><Link to='/forum' state={{ canGoBack: true }}>Forum</Link></li>
        <li><Anchor onClick={open} c="red">Submit a feedback</Anchor></li>
      </ul>
      <ul className="footer-links">
        <h3>Account</h3>
        <li><Link to='/profile' state={{ canGoBack: true }}>Profile</Link></li>
        <li><Link to='/login' state={{ canGoBack: true }}>Login</Link></li>
        <li><Link to='/logout' state={{ canGoBack: true }}>Logout</Link></li>
      </ul>
      <ul>
        <h3>Developers</h3>
        <li>Amy Nguyen</li>
        <li>Axel Brochu</li>
        <li>Bianca Rossetti</li>
        <li>Marin Melentii</li>
      </ul>
    </section>
    <aside className="footer-copyright">
      <p>Copyright &copy; 2025</p>
    </aside>
    <Modal opened={opened} onClose={close} title='Submit a feedback!' centered size="auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          close();
        }}
        style={{ width: "100%"}}
      >
        <Stack gap="md" justify='center' align="center">
          <TextInput
            label="Feedback message:"
            value={formData.feedback}
            onChange={(e) => setFormData({...formData, feedback: e.target.value})}
          />
          <Select
            onOptionSubmit={(value) => setFormData({...formData, type: value})}
            label="Type"
            data={['Bug', 'Feature', 'Other']}
          />
          <MinecraftButton type="submit" variant="filled">
            Submit Feedback
          </MinecraftButton>
        </Stack>
      </form>
    </Modal>
  </footer>;
}