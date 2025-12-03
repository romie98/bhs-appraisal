# PR Summary: Fix Hardware Classification in Evidence Classification Engine

## Issue
Evidence containing computer hardware images (computer ports, internal components, cables, motherboards) was being incorrectly classified as GP 6 (Professional Conduct/Technology Integration) in both:
1. **Photo evidence** (OCR text from uploaded photos)
2. **Lesson plans** (text extracted from lesson plan documents)

This has been corrected to ensure hardware-related evidence is only classified under GP 1 (Subject Content Knowledge) or GP 2 (Pedagogy & Teaching Strategies).

## Changes Made

### 1. Added Hardware Detection Function (`_detect_hardware_content`)
- **Location**: `backend/app/services/ai_service.py`
- **Purpose**: Detects hardware-related content in OCR text before AI classification
- **Features**:
  - Detects GP1 keywords: "identify the ports", "computer ports", "USB port", "HDMI", "VGA", "hardware components", "motherboard", "technical analysis", etc.
  - Detects GP2 keywords: "lesson", "students", "activity", "assignment", "teach", "classwork", "practice exercise", etc.
  - Additional hardware indicators: port, ports, USB, HDMI, VGA, DVI, ethernet, motherboard, CPU, RAM, hardware, component, cable, connector, socket
  - Returns suggested GP classification (GP1 for technical content, GP2 for teaching context)
  - Prioritizes GP2 when both technical and teaching keywords are present

### 2. Updated `analyze_photo_evidence` Function
- **Location**: `backend/app/services/ai_service.py`
- **Changes**:
  - Added pre-processing: Detects hardware content before AI analysis
  - Updated AI prompt: Explicitly excludes hardware content from GP6, GP5, GP4, and GP3
  - Added post-processing: Enforces classification rules after AI response
  - Removes any hardware classifications from GP3, GP4, GP5, GP6
  - Ensures hardware content is assigned to GP1 or GP2 if not already classified

### 3. Updated `extract_lesson_evidence` Function
- **Location**: `backend/app/services/ai_service.py`
- **Changes**:
  - Added pre-processing: Detects hardware content in lesson plan text before AI analysis
  - Updated AI prompt: Explicitly excludes hardware content from GP6, GP5, GP4, and GP3
  - Added post-processing: Filters out hardware-related evidence from GP3, GP4, GP5, GP6
  - Ensures hardware content is assigned to GP1 or GP2 if not already classified
  - Uses keyword filtering to remove hardware evidence from prohibited GPs

### 4. Classification Rules Implemented

#### Rule 1: Hardware → GP1
If evidence contains:
- Images of computer ports
- Diagrams of internal hardware
- Component identification
- Technical explanation of devices
- Hardware analysis

**Classification**: GP 1 – Teacher knows the subject content

#### Rule 2: Hardware Teaching Activity → GP2
If evidence appears to be:
- A lesson activity using the hardware image
- A student task analyzing the hardware
- A teaching strategy involving ICT or demonstration

**Classification**: GP 2 – Teacher knows how to teach the subject

#### Rule 3: Exclusion Rules
Hardware content is **NEVER** classified under:
- GP 6 (Technology Integration/Professional Conduct)
- GP 5 (Community Engagement)
- GP 4 (Professional Development)
- GP 3 (Student Assessment & Feedback)

#### Rule 4: Fallback Priority
If evidence matches hardware content but contains both technical and teaching references → **PRIORITIZE GP2**

### 5. Test Cases Added
- **Location**: `backend/tests/test_hardware_classification.py`
- **Coverage**:
  - Hardware detection function tests
  - Photo evidence classification tests with mocked AI responses
  - Lesson plan evidence classification tests with mocked AI responses
  - Keyword detection tests for specific hardware terms
  - Tests ensuring hardware is never classified as GP6, GP5, GP4, GP3 (in both photos and lesson plans)
  - Tests ensuring hardware is correctly assigned to GP1 or GP2
  - Tests ensuring non-hardware content is unaffected

## Key Features

1. **Pre-Processing**: Hardware content is detected before AI analysis using keyword matching
2. **AI Prompt Enhancement**: The AI prompt explicitly warns against classifying hardware as GP6, GP5, GP4, or GP3
3. **Post-Processing Enforcement**: After AI classification, hardware content is automatically removed from prohibited GPs and assigned to GP1 or GP2 if needed
4. **Comprehensive Testing**: Full test suite ensures the classification rules work correctly

## Testing

Run the test suite:
```bash
cd backend
pytest tests/test_hardware_classification.py -v
```

All tests verify that:
- Hardware content is detected correctly
- Hardware is never classified as GP6, GP5, GP4, or GP3
- Hardware is correctly assigned to GP1 or GP2
- Non-hardware content is unaffected by the changes

## Files Modified

1. `backend/app/services/ai_service.py`
   - Added `_detect_hardware_content()` function (shared by both photo and lesson plan functions)
   - Updated `analyze_photo_evidence()` function with hardware detection and enforcement
   - Updated `extract_lesson_evidence()` function with hardware detection and enforcement

## Files Added

1. `backend/tests/__init__.py` - Tests package initialization
2. `backend/tests/test_hardware_classification.py` - Comprehensive test suite
3. `PR_SUMMARY.md` - This summary document

## Impact

- **Breaking Changes**: None
- **Backward Compatibility**: Maintained - non-hardware content classification is unaffected
- **Performance**: Minimal impact - hardware detection is fast keyword matching
- **User Experience**: Improved accuracy in evidence classification for hardware-related content

## Verification

To verify the fix works:
1. Upload a photo containing computer hardware (ports, components, etc.)
2. Check that the evidence is classified as GP1 or GP2 only
3. Verify that GP6, GP5, GP4, GP3 do not contain hardware classifications

