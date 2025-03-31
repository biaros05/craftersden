import React, { useState } from "react";
import Link from "./Navigation/Link";
import '../styles/footer.css'
import { Anchor, Modal, Stack, Select, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from "../hooks/useAuth";


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

  async function handleSubmit(){

  }
  return <footer className="footer-container">
    <section className="site-footer">
      <ul className="footer-links">
        <h3>Site</h3>
        <li><Link to='/' state={{ canGoBack: true }}>Welcome</Link></li>
        <li><Link to='/den' state={{ canGoBack: true }}>Den</Link></li>
        <li><Link to='/forum' state={{ canGoBack: true }}>Forum</Link></li>
        <li><Anchor onClick={ } c="red">Submit a feedback</Anchor></li>
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
    <Modal opened={opened} onClose={close} title='Submit a feedback!' centered>
      <form
        onSubmit={(e) => {
          e.preventDefault;
          close();
        }}
      >
        <Stack>
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
        </Stack>
      </form>
    </Modal>
  </footer>;
}