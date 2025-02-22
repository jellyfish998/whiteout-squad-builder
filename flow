flowchart TD;
  Start --> Step1["Step 1: User Inputs"]
  Step1 -->|Enter Total Troops per Type & Level| Step1a["Enter Total Troops per Type & Level"]
  Step1 -->|Set Desired Troop Ratios| Step1b["Set Desired Troop Ratios (Infantry, Lancer, Marksman)"]
  Step1 -->|Input Number of Squads & March Sizes| Step1c["Input Number of Squads & March Sizes"]
  Step1 -->|Toggle Rally Caller Squad| Step1d["Toggle Rally Caller Squad (Enable/Disable)"]

  Step1 --> Step2["Step 2: Validate Inputs"]
  Step2 -->|Check Troop Counts > 0| Step2a["Check Troop Counts > 0"]
  Step2 -->|Check Desired Ratios Sum to 100%| Step2b["Check Desired Ratios Sum to 100%"]
  Step2 -->|Ensure March Sizes are Valid| Step2c["Ensure March Sizes are Valid"]
  Step2 -->|ERROR Handling| Step2d["ERROR Handling (Stop & Display Error if Invalid)"]

  Step2 --> Step3["Step 3: Allocate Rally Caller (if enabled)"]
  Step3 -->|Assign Troops to Rally Caller| Step3a["Assign Troops to Rally Caller Using Desired Ratio"]
  Step3 -->|Deduct Used Troops from Available Troops| Step3b["Deduct Used Troops from Available Troops"]

  Step3 --> Step4["Step 4: Calculate Adjusted Ratios"]
  Step4 -->|Compute Available Troops After Rally Caller Allocation| Step4a["Compute Available Troops After Rally Caller Allocation"]
  Step4 -->|Scale Desired Ratios Based on Available Troops| Step4b["Scale Desired Ratios Based on Available Troops"]
  Step4 -->|Normalize Adjusted Ratios| Step4c["Normalize Adjusted Ratios to Ensure Correct Distribution"]

  Step4 --> Step5["Step 5: Distribute Troops to Squads"]
  Step5 -->|Loop Through Squads| Step5a["Loop Through Squads"]
  Step5 -->|Assign Troops Based on Adjusted Ratios| Step5b["Assign Troops Based on Adjusted Ratios"]
  Step5 -->|Prioritize High-Level & High-Sequence Troops| Step5c["Prioritize High-Level & High-Sequence Troops"]
  Step5 -->|Stop Allocating When Troops Are Exhausted| Step5d["Stop Allocating When Troops Are Exhausted"]

  Step5 --> Step6["Step 6: Display Results"]
  Step6 -->|Show Adjusted Ratios| Step6a["Show Adjusted Ratios (vs. Desired Ratios)"]
  Step6 -->|Display Squad Troop Composition| Step6b["Display Squad Troop Composition"]

  Step6 --> Step7["Step 7: JSON Export (Optional)"]
  Step7 -->|Allow User to Download Squad Allocation as JSON| Step7a["Allow User to Download Squad Allocation as JSON"]
  Step7 -->|Compare JSON Output with Spreadsheet| Step7b["Compare JSON Output with Spreadsheet for Validation"]

  Step7 --> End