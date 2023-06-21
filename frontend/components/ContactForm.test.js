import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>);

});

test('renders the contact form header', () => {
   render(<ContactForm/>);
   const headerElement = screen.queryByText(/Contact Form/);
   expect(headerElement).toBeInTheDocument();
   expect(headerElement).toBeTruthy();
   expect(headerElement).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstName = screen.getByLabelText(/First Name*/)
    userEvent.type(firstName, "999");

    const errorsMess = await screen.findAllByTestId("error");
    expect(errorsMess).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
    
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(()=>{
        const errorsMess = screen.queryAllByTestId("error");
        expect(errorsMess).toHaveLength(3);
    
    }) 
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const nameElement = screen.getByLabelText(/first name*/i);
    userEvent.type(nameElement, "999999");

    const lastElement = screen.getByLabelText(/last name*/i);
    userEvent.type(lastElement, "9999999");
    

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errorMess = await screen.findAllByTestId("error");
    expect(errorMess).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
   render(<ContactForm/>);

   const emailElement = screen.getByLabelText(/email*/i);
   userEvent.type(emailElement, "9999");

   const errorMess = await screen.findByText(/email must be a valid email address/);
   expect(errorMess).toBeInTheDocument();
   
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const nameElement = screen.getByLabelText(/first name*/i);
    userEvent.type(nameElement, "999999");

    const emailElement = screen.getByLabelText(/email*/i);
    userEvent.type(emailElement, "9999@gov.com");

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errorMess = await screen.findByText(/lastName is a required field/i);
   expect(errorMess).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);

    userEvent.type(firstName, "9999999");
    userEvent.type(lastName, "999999");
    userEvent.type(email, "999@gov.com");

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor( ()=> {
        const first = screen.queryByText("9999999");
        const last = screen.queryByText("999999");
        const email = screen.queryByText("999@gov.com");
        const messsageDis = screen.queryByTestId("messageDisplay")

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(messsageDis).not.toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const messageElement = screen.getByLabelText(/message*/i)

    userEvent.type(firstName, "9999999");
    userEvent.type(lastName, "999999");
    userEvent.type(email, "999@gov.com");
    userEvent.type(messageElement, "Message Text")

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor( ()=> {
        const first = screen.queryByText("9999999");
        const last = screen.queryByText("999999");
        const email = screen.queryByText("999@gov.com");
        const messsageDis = screen.queryByText("Message Text")

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(messsageDis).toBeInTheDocument();
    })
});
