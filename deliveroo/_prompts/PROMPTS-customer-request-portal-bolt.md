
prompt (bolt):

```
I need you to create a simple Vuex application Which would guide the customer across filling in a form for, yeah, requesting some storage in a warehouse.

## Multi-Step Customer Storage Request Process
Below is a short markdown specification for a B2B customer storage request process, including step-by-step UI guidance, required information, and communication at each stage.

--- ### **Step 1: Cargo Details**
UI Elements:

Progress indicator (Step 1 of 3)
Cargo Description input (text area, possibly with icon)
Storage Duration (dropdown: e.g., 1 month, 3 months, 6 months, 12 months)
Warehouse selection (dropdown: e.g., Warehouse A, B, C)
"Next" button
Information Collected:

Cargo description (type, size, special requirements)
Desired storage duration
Preferred warehouse location
Communication:

Brief instructions: "Please provide details about the cargo you wish to store."
Validation: Ensure all fields are filled before proceeding.
--- ### **Step 2: Customer & Contact Information**
UI Elements:

Progress indicator (Step 2 of 3)
Company Name (text input)
Contact Person (text input)
Email Address (email input)
Phone Number (text input)
"Back" and "Next" buttons
Information Collected:

Business name
Contact person’s full name
Email address
Phone number
Communication:

Brief instructions: "Enter your company and contact details for communication and invoicing."
Validation: Check for valid email and phone formats.
--- ### **Step 3: Review & Confirmation**
UI Elements:

Progress indicator (Step 3 of 3)
Summary of all provided information (read-only)
"Edit" links for each section
Terms and Conditions checkbox
"Submit Request" button
Information Displayed:

Cargo details, storage duration, warehouse
Company and contact information
Communication:

Instruction: "Please review your request. Confirm all details are correct before submitting."
Confirmation: "By submitting, you agree to our storage terms and conditions."
--- ### **Post-Submission: Acknowledgement**
UI Elements:

Confirmation message: "Your storage request has been submitted successfully."
Reference number for tracking
Estimated response time
Contact information for support
Communication:

Thank you note
Next steps: "Our team will review your request and contact you within X business days."
--- ## **UI Flow Summary** | Step | Title | Inputs/Displays | Actions/Buttons | Communication | |------|------------------------|--------------------------------------------------|------------------------|---------------------------------------| | 1 | Cargo Details | Description, Duration, Warehouse | Next | Brief instructions, validation | | 2 | Customer Information | Company, Contact, Email, Phone | Back, Next | Brief instructions, validation | | 3 | Review & Confirmation | Summary, Edit links, T&C checkbox | Back, Submit Request | Review prompt, T&C agreement | | - | Submission Complete | Confirmation message, reference number | - | Thank you, next steps, support info | --- ### **Additional Notes**
Each step should prevent proceeding unless required fields are completed.
Use clear progress indicators to reduce user uncertainty.
Provide contextual help or tooltips for complex fields.
Ensure accessibility and mobile responsiveness.
Consider saving progress for logged-in users.
```
