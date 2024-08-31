import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSelector } from 'react-redux';


const Help = () => {
  const theme = useSelector((state) => state.auth.theme);
  return (
    <div className={`p-6 min-h-screen ${theme == 'light' ? 'bg-white' : 'bg-black'}`}>
      <h2 className={`text-2xl font-semibold mb-4 ${theme == 'light' ? 'text-black' : 'text-white'}`}>Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className={`${theme == 'light' ? 'text-black' : 'text-white'}`}>
        <AccordionItem value="faq1">
          <AccordionTrigger>What is Syncify?</AccordionTrigger>
          <AccordionContent>
            Syncify is a project management and collaboration tool designed to help teams organize tasks, communicate in real-time, and keep track of project progress. It provides features like task management, Kanban boards, team chat, and settings customization.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq2">
          <AccordionTrigger>How do I create a new project?</AccordionTrigger>
          <AccordionContent>
            After logging in, you can create a new project from the "ChooseProjectPage" by clicking on the "Create New Project" button. You'll be prompted to enter the project name and description before proceeding.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq3">
          <AccordionTrigger>How does the task management feature work?</AccordionTrigger>
          <AccordionContent>
            Syncify's task management feature allows you to create, update, and track tasks within your project. Tasks can be organized into different sections like "To Do," "On Going," and "Completed." You can also assign tasks to team members and set due dates.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq4">
          <AccordionTrigger>How do I use the Kanban board?</AccordionTrigger>
          <AccordionContent>
            The Kanban board in Syncify helps you visualize your project's workflow. Tasks are displayed in columns representing different stages of progress, such as "To Do," "In Progress," and "Done." You can drag and drop tasks between columns to update their status.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq5">
          <AccordionTrigger>Can I chat with my team members in real-time?</AccordionTrigger>
          <AccordionContent>
            Yes, Syncify includes a real-time chat feature where you can communicate with your team members. Each project has its own chat room, allowing you to discuss tasks and updates in real-time. Messages are stored in Firebase for persistence.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq6">
          <AccordionTrigger>How can I change the theme of Syncify?</AccordionTrigger>
          <AccordionContent>
            You can change the theme of Syncify from the Settings page. There, you'll find an option to toggle between light and dark modes, allowing you to customize the appearance of the interface to your preference.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq7">
          <AccordionTrigger>How do I delete my account?</AccordionTrigger>
          <AccordionContent>
            To delete your account, go to the Settings page and select the "Delete Account" option. After confirming, your account will be permanently deleted, and you will be redirected to the login page.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Help;
