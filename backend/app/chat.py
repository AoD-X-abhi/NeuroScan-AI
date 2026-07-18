import os

import requests

import datetime



SYSTEM_PROMPT = (

    "You are NeuroScan AI, an advanced medical imaging assistant. "

    "You specialize ONLY in brain MRI analysis, brain tumors (glioma, meningioma, pituitary), "

    "Alzheimer's disease (dementia stages), and lumbar spinal stenosis (disc herniation, thecal sac compression). "

    "If the user asks questions that are not related to medical imaging, MRI, brain tumors, "

    "Alzheimer's disease, or spinal stenosis, politely refuse to answer, stating that you can "

    "only assist with topics within NeuroScan AI's medical imaging domains."

)



KNOWLEDGE_BASE = {

    "glioma": (

        "Gliomas are primary brain tumors that originate in the glial cells, which support and protect neurons. "

        "On T1-weighted post-contrast MRI scans, high-grade gliomas typically present as irregular, thick-walled "

        "ring-enhancing lesions with surrounding vasogenic edema (bright on T2/FLAIR). Low-grade gliomas often "

        "appear non-enhancing and homogeneous. ResNet-50 classifies these by identifying textural irregularities "

        "and margins."

    ),

    "meningioma": (

        "Meningiomas are the most common primary brain tumors, arising from the arachnoid cap cells of the meninges. "

        "On MRI, they appear as well-circumscribed, extra-axial dural-based masses that enhance intensely and "

        "homogeneously after contrast administration. A key diagnostic marker is the 'dural tail sign'. Grad-CAM "

        "usually flags the dural attachment region."

    ),

    "pituitary": (

        "Pituitary tumors, primarily adenomas, develop in the pituitary gland within the sella turcica. On MRI, "

        "microadenomas (<10mm) appear as hypo-enhancing areas relative to the normal gland on dynamic contrast scans, "

        "while macroadenomas (>10mm) can cause sellar expansion and present a classic 'snowman' configuration due to "

        "suprasellar extension. Grad-CAM flags the intrasellar mass and surrounding optic chiasm margins."

    ),

    "notumor": (

        "No Tumor scans show normal anatomical structures of the brain. The cerebral hemispheres, ventricles, "

        "sulci, and brainstem are symmetric and show no pathological shifts, signal changes, or abnormal enhancements. "

        "Grad-CAM maps for these scans are diffuse or show no localized hotspot, indicating no localized focus."

    ),

    "alzheimer": (

        "Alzheimer's disease is characterized on MRI by progressive, symmetric cerebral atrophy, particularly "

        "in the temporal lobes and hippocampi. This atrophy leads to a secondary enlargement of the lateral ventricles "

        "and widening of the cortical sulci. ResNet-50 evaluates these structural volume shifts to stage dementia "

        "from very mild to moderate."

    ),

    "dementia": (

        "Dementia on MRI is classified into stages based on cerebral volume loss. Non-Demented scans show "

        "normal ventricular sizes and hippocampal volume. Very Mild and Mild stages display focal temporal lobe "

        "atrophy and early sulcal widening. Moderate Demented scans show severe, widespread atrophy and marked "

        "dilations of the lateral ventricles."

    ),

    "stenosis": (

        "Lumbar spinal stenosis (LSS) is the narrowing of the spinal canal, leading to compression of the "

        "thecal sac and lumbar nerve roots (vertebrae L1-L5). It is commonly caused by intervertebral disc herniation, "

        "ligamentum flavum hypertrophy, and facet joint arthropathy. Sagittal MRI scans are critical for "

        "detecting canal narrowing."

    ),

    "herniated disc": (

        "A herniated disc occurs when the nucleus pulposus protrudes through a tear in the outer annulus fibrosus, "

        "extending beyond the edges of the vertebral body. On sagittal T2-weighted MRI scans, this is visible as a "

        "posterior disc displacement compressing the adjacent thecal sac or exiting nerve root."

    ),

    "thecal sac": (

        "The thecal sac is the protective membrane holding the spinal cord and cauda equina. In spinal stenosis, "

        "disc protrusions or bone spurs compress this sac. On T2-weighted MRI, the cerebrospinal fluid (CSF) inside "

        "the sac appears bright, making the narrowing and indentation of the sac highly visible as a constriction."

    ),

    "grad-cam": (

        "Grad-CAM (Gradient-weighted Class Activation Mapping) is an explainability algorithm. It computes "

        "the gradients of a target class score flowing into the final convolutional layer of the network. "

        "The resulting heatmap highlights the visual features that contributed most to the model's classification "

        "decision, such as the exact borders of a tumor or compressed spinal cord regions."

    ),

    "mri": (

        "MRI (Magnetic Resonance Imaging) utilizes strong magnetic fields and radio waves to generate detailed "

        "cross-sectional images of soft tissues. T1-weighted scans highlight anatomy, T2-weighted scans emphasize "

        "fluid (making CSF bright), and FLAIR suppresses fluid to highlight parenchymal lesions."

    )

}



def query_chat_assistant(message: str, api_key: str = None) -> str:

    msg_lower = message.lower()

    

    if api_key:

        try:

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"

            payload = {

                "contents": [

                    {

                        "parts": [

                            {"text": f"{SYSTEM_PROMPT}\n\nUser Question: {message}"}

                        ]

                    }

                ]

            }

            res = requests.post(url, json=payload, timeout=10)

            if res.status_code == 200:

                res_json = res.json()

                text = res_json["candidates"][0]["content"]["parts"][0]["text"]

                return text

        except Exception as e:

            print(f"Error querying Gemini API: {e}")

            

                                    

    response_parts = []

    for keyword, info in KNOWLEDGE_BASE.items():

        if keyword in msg_lower:

            response_parts.append(info)

            

    if response_parts:

        return "\n\n".join(response_parts)

        

    return (

        "I am your NeuroScan AI assistant. I can only assist you with questions related to: \n"

        "1. Brain MRI Analysis & Tumors (Glioma, Meningioma, Pituitary, or Healthy Scans).\n"

        "2. Alzheimer's Disease & Dementia staging (Atrophy, ventricular dilation).\n"

        "3. Spine MRI Disease Detection (Lumbar spinal stenosis, herniated discs, thecal sac compression).\n"

        "4. How our Grad-CAM localization model computes visual saliency maps.\n\n"

        "Please ask a question about these medical imaging topics."

    )

