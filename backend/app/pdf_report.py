import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))

# Comprehensive rule-based descriptions (~40-50 lines of clinical-grade text) for all diagnostic classes
DISEASE_REFERENCES = {
    # Brain Tumor Modality
    "glioma": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Gliomas are primary central nervous system (CNS) tumors that originate from glial cells (astrocytes, oligodendrocytes, or ependymal cells) which support and protect neurons. "
        "They constitute approximately 30% of all brain tumors and 80% of all malignant brain tumors. Gliomas are classified into WHO grades I through IV. Grade I and II represent low-grade gliomas, "
        "which are slow-growing but carry a high propensity for transformation into high-grade lesions. Grade III (anaplastic) and Grade IV (glioblastoma multiforme, GBM) represent high-grade malignant gliomas. "
        "GBM is the most aggressive subtype, characterized by rapid mitotic activity, nuclear atypia, microvascular proliferation, and areas of pseudopalisading necrosis.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "On T1-weighted sequences, gliomas typically present as hypo-intense to iso-intense masses within the cerebral hemispheres. High-grade gliomas characteristically demonstrate thick, irregular, "
        "ring-like contrast enhancement following gadolinium administration, reflecting a disrupted blood-brain barrier. Marked surrounding vasogenic edema is highly visible on T2-weighted and "
        "FLAIR sequences as hyper-intense regions, causing a prominent mass effect with sulcal effacement and potential midline shift. Low-grade gliomas often display homogeneous high T2/FLAIR signal "
        "intensity with minimal to no post-contrast enhancement.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Patients commonly present with progressive neurological deficits dependent on the tumor localization. Headache (often worse in the morning and exacerbated by Valsalva maneuvers) is a classic "
        "symptom of elevated intracranial pressure. Focal seizures are highly prevalent, particularly in low-grade lesions. Other manifestations include cognitive changes, hemiparesis, sensory loss, "
        "aphasia, and visual disturbances.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Definitive diagnosis requires stereotactic biopsy or surgical resection for histological and molecular grading (such as IDH mutation status and MGMT promoter methylation). "
        "Standard management for high-grade gliomas utilizes the Stupp protocol: maximal safe surgical resection followed by adjuvant radiotherapy and temozolomide chemotherapy. "
        "Serial follow-up MRI scans are indicated every 2-3 months to monitor for tumor recurrence or pseudoprogression."
    ),
    "meningioma": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Meningiomas are extra-axial central nervous system neoplasms that arise from the arachnoid cap cells of the meninges, the protective membranes enveloping the brain and spinal cord. "
        "They represent the most common primary intracranial tumor, accounting for over one-third of all diagnosed cases. The vast majority of meningiomas are benign (WHO Grade I, ~80-90%), "
        "with atypical (WHO Grade II, ~10%) and anaplastic/malignant (WHO Grade III, ~1-3%) variants occurring less frequently. They typically grow slowly and exert pressure on adjacent "
        "brain parenchyma or cranial nerves rather than invading the brain tissue directly.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "Meningiomas present as well-circumscribed, dural-based masses. They are typically iso-intense to gray matter on both T1 and T2-weighted sequences. Post-contrast T1-weighted images demonstrate "
        "intense, homogeneous enhancement. A key diagnostic identifier is the 'dural tail sign'—a tapering enhancement of the adjacent dura mater flanking the mass. "
        "They may display a CSF cleft, which is a thin rim of cerebrospinal fluid separating the extra-axial mass from the brain cortex. Hyperostosis (bone thickening) of the overlying skull is common.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Many meningiomas are asymptomatic and discovered incidentally. Symptomatic lesions cause deficits by compressing local brain structures. Typical presentations include localized headache, "
        "seizures, progressive focal deficits (such as hemiparesis), or cranial neuropathies (such as anosmia or visual field deficits) depending on the anatomical location (e.g., parasagittal, olfactory groove, or sphenoid wing).<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Incidental, asymptomatic low-grade meningiomas are often managed conservatively with active surveillance via serial MRI scans. For symptomatic, growing, or high-grade tumors, "
        "maximal safe surgical resection is the primary treatment modality. Radiotherapy or stereotactic radiosurgery (SRS) is utilized for recurrent tumors, atypical/malignant grades, "
        "or surgically inaccessible locations close to critical neurovascular structures."
    ),
    "pituitary": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Pituitary tumors, almost exclusively pituitary adenomas, are benign neoplasms arising from the anterior lobe of the pituitary gland (adenohypophysis). They account for approximately "
        "10-15% of all intracranial tumors. These lesions are classified by size into microadenomas (<10 mm in diameter) and macroadenomas (>=10 mm in diameter). "
        "They are also categorized functionally: secretory/functioning adenomas (secreting hormones such as prolactin, ACTH, growth hormone, or TSH) and non-functioning adenomas, "
        "which do not secrete hormones but cause progressive compressive mass effects on surrounding sellar structures.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "Sellar-specific dynamic contrast-enhanced MRI is the diagnostic gold standard. Microadenomas typically appear as hypo-intense lesions on T1-weighted sequences and demonstrate delayed, "
        "slower enhancement relative to the surrounding highly vascular normal pituitary gland. Macroadenomas appear as larger sellar masses, often expanding the sella turcica and extending into the "
        "suprasellar space. This suprasellar extension frequently creates a characteristic 'snowman' or 'figure-eight' appearance due to constriction by the diaphragm sellae, causing compression of the optic chiasm.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Secretory adenomas present with distinct endocrine syndromes: hyperprolactinemia (galactorrhea, amenorrhea, infertility), Cushing's disease (ACTH excess), or acromegaly (growth hormone excess). "
        "Macroadenomas typically present with mass-effect symptoms: progressive headaches and visual field deficits, classically a bilateral loss of the outer fields (bitemporal hemianopsia) due to "
        "chiasm compression. Pituitary apoplexy (acute hemorrhage/infarction) is a rare emergency presenting with sudden severe headache and vision loss.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Comprehensive diagnostic workups include endocrine blood tests and formal visual field examinations. Treatment depends on the tumor type: prolactinomas are primary managed medically "
        "using dopamine agonists (cabergoline). For non-functioning macroadenomas causing mass effects, or hormone-secreting tumors refractory to medical care, transsphenoidal surgical resection "
        "is the treatment of choice. Radiation therapy is reserved for residual or recurrent tumors."
    ),
    "notumor": (
        "<b>Anatomical Overview & Radiographical Findings:</b><br/>"
        "The submitted brain MRI demonstrates normal intracranial anatomy. There is no evidence of intracranial mass lesions, abnormal focal parenchymal enhancement, or structural distortion. "
        "The cerebral hemispheres, basal ganglia, brainstem, and cerebellum display symmetric structures with normal signal intensity profiles across all imaging sequences. "
        "The ventricular system is symmetric and shows no dilation, compression, or midline shift. The cortical sulci, basilar cisterns, and subarachnoid spaces are normal in caliber.<br/><br/>"
        "<b>Explanation of Negative Findings:</b><br/>"
        "A negative tumor classification indicates that the neural tissue lacks abnormal tissue density, vascular breaches, or cellular proliferations characteristic of primary or metastatic neoplasms. "
        "Explainable AI (Grad-CAM) mapping on negative tumor scans shows diffuse, low-intensity background activations. This indicates that the neural network did not detect any localized "
        "pathological regions (such as contrast-enhancing rings, mass edema, or sellar expansions) to trigger a tumor staging.<br/><br/>"
        "<b>Clinical Implications & Baseline References:</b><br/>"
        "These findings establish a normal baseline. In patients presenting with acute headaches, dizziness, or sensory deficits, the absence of an intracranial mass shifts diagnostic focus "
        "towards non-structural etiologies (e.g., tension headache, migraine, vestibular disorders, metabolic changes, or transient ischemic attacks).<br/><br/>"
        "<b>Follow-Up & Clinical Maintenance:</b><br/>"
        "No neurosurgical intervention or oncological staging is indicated. Management should focus on symptomatic relief for the presenting complaint. If new focal neurological deficits emerge "
        "(such as sensory alterations, localized weakness, or cognitive changes), a repeat contrast-enhanced MRI study should be considered to rule out early-stage pathology."
    ),
    
    # Alzheimer's Modality
    "nondemented": (
        "<b>Anatomical Structure & Normal Brain Aging:</b><br/>"
        "This MRI scan demonstrates normal brain structures matching a cognitively healthy individual. The cerebral cortex shows normal thickness with well-preserved cortical gyri and sulcal spaces. "
        "The hippocampus—the critical region within the medial temporal lobe responsible for memory consolidation—displays normal volume and tissue density with no signs of pathological shrinkage. "
        "The lateral ventricles and temporal horns show normal volumes without secondary enlargement. These findings represent a baseline of high cognitive reserve.<br/><br/>"
        "<b>Pathology of Healthy Control Scans:</b><br/>"
        "In a healthy control brain, there is an absence of the progressive neurodegeneration associated with Alzheimer's disease. The neural pathways are intact, and there is no significant loss of cortical "
        "synapses or gray matter. Grad-CAM saliency mapping on non-demented scans typically demonstrates diffuse activations across the temporal lobes, reflecting symmetric, healthy tissue distributions.<br/><br/>"
        "<b>Clinical Implications & Diagnostic Context:</b><br/>"
        "The absence of structural atrophy rules out moderate-to-severe neurodegenerative dementia. If the patient is presenting with subjective cognitive complaints or mild memory loss, "
        "alternative factors must be evaluated. These include reversible causes of cognitive impairment, such as thyroid dysfunction, vitamin B12 deficiency, clinical depression, chronic sleep apnea, "
        "or medication side effects.<br/><br/>"
        "<b>Preventive Health & Follow-Up Guidelines:</b><br/>"
        "No pharmacological dementia treatments are indicated. To maintain cognitive reserve, clinicians recommend lifestyle interventions, including cardiovascular exercise, cognitive engagement, "
        "and a balanced diet (e.g., Mediterranean diet). Annual clinical cognitive evaluations using standardized questionnaires (such as the MMSE or MoCA) are recommended for baseline monitoring."
    ),
    "verymilddemented": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Very Mild Cognitive Impairment (MCI) represents the transitional boundary between normal age-related cognitive decline and early-stage dementia. Pathologically, this stage is characterized "
        "by the initial accumulation of beta-amyloid plaques and hyperphosphorylated tau neurofibrillary tangles. These protein aggregations occur first in the transentorhinal and entorhinal cortex, "
        "leading to early localized synaptic loss, axonal retraction, and mild neuronal damage before widespread brain tissue loss becomes apparent.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "On high-resolution structural MRI scans, very mild dementia is marked by early, subtle changes. Medial temporal lobe atrophy (MTA) may be detected, showing minor volume loss in the entorhinal "
        "cortex and anterior hippocampus. Slight widening of the temporal horns of the lateral ventricles may be observed. Cortical sulci in the parietal and frontal lobes may appear minimally prominent, "
        "but global brain volume is largely preserved. Grad-CAM visual highlights often target the entorhinal margin, flagging these early tissue volume shifts.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Patients at this stage present with mild cognitive deficits that do not significantly impair daily functioning. Symptoms include forgetfulness of recent events, misplacing items, "
        "difficulty planning complex tasks, or word-finding challenges. The patient or family members are typically aware of these cognitive changes, but the patient remains independent in daily life.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Workup includes neuropsychological testing (MoCA) to document mild deficits. Management focuses on risk-reduction strategies (managing hypertension, diabetes, and hyperlipidemia) and "
        "addressing potentially reversible factors. While acetylcholinesterase inhibitors are generally not prescribed at this early stage, clinical trials for disease-modifying monoclonal "
        "antibodies targeting amyloid plaques may be considered. Cognitive monitoring is recommended every 6 months."
    ),
    "milddemented": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Mild Dementia represents the early manifest stage of Alzheimer's disease. Pathologically, neurofibrillary tangles and amyloid plaques have spread from the entorhinal region to wrap around "
        "the hippocampus and the neocortex. Widespread synaptic loss and localized neuronal cell death trigger progressive shrinkage of gray matter, leading to early functional impairments in memory, "
        "spatial navigation, and executive decision-making.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "MRI scans reveal diagnostic markers. There is visible bilateral atrophy of the hippocampi and entorhinal cortex, presenting as a widening of the choroid fissure and temporal horns. "
        "The lateral ventricles demonstrate mild enlargement, and the cortical sulci along the temporoparietal regions show prominent widening. Grad-CAM saliency maps focus on the medial temporal lobes, "
        "specifically highlighting the margins of the hippocampal atrophy.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Patients experience cognitive changes that interfere with daily activities. Symptoms include significant short-term memory loss (e.g., repeating questions), getting lost in familiar locations, "
        "difficulty managing finances, and trouble performing multi-step tasks (like cooking). Subtle personality shifts, apathy, or mild anxiety may develop, and assistance is needed for complex activities.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Diagnosis is established through neuropsychological evaluations and structural brain imaging. Pharmacotherapy with acetylcholinesterase inhibitors (such as Donepezil, Rivastigmine, or Galantamine) "
        "is standard care to support cholinergic neurotransmission. Lifestyle adjustments, occupational therapy, and cognitive exercises are recommended. Monitoring should be scheduled every 6 months to track progression."
    ),
    "moderatedemented": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Moderate Dementia represents an advanced stage of Alzheimer's disease. Pathologically, neurodegeneration has spread globally, affecting the frontal, temporal, and parietal association cortices. "
        "Severe synaptic destruction and neuronal loss have led to significant structural breakdown. The brain's natural self-repair mechanisms are overwhelmed, resulting in profound deficits in "
        "long-term memory, language, spatial awareness, and basic executive functioning.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "MRI scans show marked, widespread structural changes. There is severe, symmetric hippocampal atrophy accompanied by significant enlargement of the temporal horns. "
        "The lateral ventricles are markedly dilated (hydrocephalus ex vacuo). Widespread cortical thinning is visible, presenting as deep, wide sulci and thin gyri, particularly in the temporoparietal and "
        "frontal lobes. Grad-CAM visual activation maps heavily target the dilated ventricles and the deep temporal clefts, highlighting the severe tissue loss.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "Patients exhibit significant cognitive and functional deficits. Memory loss is severe, affecting both short-term recall and long-term memories (e.g., forgetting personal history). "
        "Aphasia (difficulty speaking/understanding) is prominent, and patients experience severe disorientation regarding time and place. Assistance is required for basic activities of daily living "
        "(ADLs), such as dressing, bathing, and toileting. Behavioral symptoms, including agitation, delusions, or wandering, may occur.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Management focuses on supportive care and preserving quality of life. Pharmacotherapy typically combines an acetylcholinesterase inhibitor with Memantine (an NMDA receptor antagonist) "
        "to manage cognitive and functional symptoms. Widespread support services, caregiver training, safety modifications, and structured daily routines are essential. Regular clinical reviews are needed "
        "to manage behavioral changes."
    ),
    
    # Spine Modality
    "herniated disc": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Lumbar disc herniation is a localized displacement of intervertebral disc material (nucleus pulposus or annulus fibrosus) beyond the margins of the vertebral body. "
        "It typically results from age-related disc degeneration, repetitive mechanical strain, or acute trauma. The outer fibers of the annulus fibrosus weaken or tear, "
        "allowing the soft inner nucleus pulposus to protrude posteriorly. This protrusion can compress adjacent neural structures, causing localized inflammation and mechanical irritation of the exiting "
        "or traversing nerve roots (radiculopathy) along vertebrae L1-L5.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "Sagittal and axial T2-weighted MRI sequences are critical for diagnosis. On sagittal views, the herniated disc appears as a posterior focal protrusion of the low-signal disc margin extending "
        "into the epidural space. This is typically accompanied by a loss of normal high T2 signal intensity within the disc nucleus, reflecting dehydration (disc desiccation). "
        "Axial views localize the herniation (paracentral, foraminal, or extraforaminal) and measure the compression of the exiting nerve root. Grad-CAM maps highlight the posterior vertebral margin at the pinched disc space.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "The classic symptom is radicular pain (sciatica) radiating down the buttock, thigh, and leg in a dermatomal pattern. Symptoms also include localized lower back pain, numbness, paresthesia, "
        "and motor weakness (such as foot drop) in the lower extremity. Symptoms are typically exacerbated by sitting, forward bending, or coughing (which increases intrathecal pressure).<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Initial management is conservative, utilizing physical therapy, NSAIDs, and activity modifications. Epidural steroid injections may be used for persistent pain. "
        "Surgical intervention, such as a microdiscectomy, is indicated for patients with progressive motor deficits, severe pain refractory to conservative care, or signs of cauda equina syndrome "
        "(saddle anesthesia, bowel/bladder dysfunction), which represents a neurosurgical emergency."
    ),
    "no stenosis": (
        "<b>Anatomical Structure & Normal Spinal Alignment:</b><br/>"
        "The submitted sagittal lumbar spine MRI demonstrates normal spinal alignment and structure. The vertebral bodies show normal height, alignment, and signal intensity with no displacement "
        "(spondylolisthesis) or osteophytic spurs. The intervertebral disc spaces are well-preserved, and the discs display normal hydration (bright T2 signal). "
        "The central spinal canal is patent, with a normal cerebrospinal fluid (CSF) column surrounding the cauda equina nerve roots. Exiting neural foramina are clear bilaterally.<br/><br/>"
        "<b>Radiographical Context:</b><br/>"
        "The absence of stenosis indicates that the central canal and neural pathways are free from structural narrowing. Grad-CAM saliency maps on normal spine scans show diffuse background "
        "activations across the vertebral structures, indicating that the network did not identify any localized compression hotspots along the spinal canal.<br/><br/>"
        "<b>Clinical Implications & Alternative Diagnoses:</b><br/>"
        "A negative finding for lumbar spinal stenosis indicates that the patient's symptoms (such as lower back pain or leg discomfort) are likely due to other causes. "
        "Alternative diagnoses to consider include acute lumbar muscle strain, ligamentous sprain, sacroiliac joint dysfunction, facet joint arthropathy, or referred pain from hip pathology.<br/><br/>"
        "<b>Preventive Care & Follow-Up Guidelines:</b><br/>"
        "No surgical or decompression interventions are indicated. Management should focus on conservative measures: core strengthening exercises, posture improvements, and weight management "
        "to reduce lumbar strain. If the patient develops new symptoms (such as radiating pain, numbness, or weakness in the legs), repeat imaging may be considered."
    ),
    "thecal sac": (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "Thecal sac compression represents severe narrowing of the central spinal canal (lumbar spinal stenosis). The thecal sac is the protective membrane holding the spinal cord, "
        "cauda equina, and cerebrospinal fluid. Narrowing is typically caused by a combination of age-related changes: intervertebral disc bulging, hypertrophy of the ligamentum flavum, "
        "and osteophytic overgrowth of the facet joints. This circumferential narrowing constricts the thecal sac, compromising the microvascular blood supply to the cauda equina and causing nerve root irritation.<br/><br/>"
        "<b>Magnetic Resonance Imaging (MRI) Characteristics:</b><br/>"
        "Sagittal and axial T2-weighted MRI scans show diagnostic markers. Sagittal views demonstrate narrowing of the central canal, visible as a loss of the normal cerebrospinal fluid signal (bright T2) "
        "surrounding the cauda equina. The cauda equina nerve roots may appear crowded or redundant. Axial views reveal constriction of the normal thecal sac profile (often resulting in a triangular "
        "or cloverleaf shape) and measure the cross-sectional area. Grad-CAM maps highlight the compressed central canal at the stenotic vertebral levels.<br/><br/>"
        "<b>Clinical Presentation & Symptomatology:</b><br/>"
        "The classic symptom is neurogenic claudication: pain, numbness, or weakness in the lower back and legs that is exacerbated by standing or walking. Symptoms are characteristically "
        "relieved by sitting or leaning forward (the 'shopping cart sign'), which increases canal diameter. Patients may also experience lower extremity paresthesias and muscle weakness.<br/><br/>"
        "<b>Diagnostic Pathways & Treatment Guidelines:</b><br/>"
        "Diagnosis combines clinical history, physical examination, and structural MRI findings. Initial treatment is conservative, using physical therapy and epidural steroid injections. "
        "For patients with severe, progressive symptoms that limit mobility, surgical decompression (such as a lumbar laminectomy) is indicated to relieve pressure on the thecal sac and cauda equina."
    )
}

def generate_pdf_report(dest_pdf_path: str, patient_name: str, patient_id: str, mri_type: str, prediction_class: str, confidence: float, timestamp_str: str, inference_time: float, image_rel_path: str, heatmap_rel_path: str, doctor_name: str):
    # Setup document template (2 pages strict layout)
    doc = SimpleDocTemplate(
        dest_pdf_path,
        pagesize=letter,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=colors.HexColor("#2563EB"),
        spaceAfter=15
    )
    
    meta_label_style = ParagraphStyle(
        "MetaLabel",
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=colors.HexColor("#475569")
    )
    
    meta_val_style = ParagraphStyle(
        "MetaValue",
        fontName="Helvetica",
        fontSize=9,
        textColor=colors.HexColor("#0F172A")
    )
    
    section_title_style = ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=10,
        spaceAfter=5
    )
    
    body_style = ParagraphStyle(
        "BodyTextCustom",
        fontName="Helvetica",
        fontSize=9,
        textColor=colors.HexColor("#1E293B"),
        leading=12
    )
    
    story = []
    
    # ---------------- PAGE 1: DIAGNOSTIC SUMMARY ----------------
    story.append(Paragraph("NEUROSCAN AI", title_style))
    story.append(Paragraph("AI-POWERED MRI ANALYSIS & DIAGNOSTIC REPORT", subtitle_style))
    
    meta_data = [
        [Paragraph("Patient Name:", meta_label_style), Paragraph(patient_name, meta_val_style), Paragraph("Report ID:", meta_label_style), Paragraph(patient_id, meta_val_style)],
        [Paragraph("MRI Modality:", meta_label_style), Paragraph(mri_type.toUpperCase(), meta_val_style), Paragraph("Date / Time:", meta_label_style), Paragraph(timestamp_str, meta_val_style)],
        [Paragraph("Analysis Mode:", meta_label_style), Paragraph("Automated Classifier", meta_val_style), Paragraph("Inference Speed:", meta_label_style), Paragraph(f"{inference_time:.4f} sec", meta_val_style)]
    ]
    
    meta_table = Table(meta_data, colWidths=[110, 160, 90, 190])
    meta_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Diagnostic Summary", section_title_style))
    
    result_text = f"The automated NeuroScan AI model evaluated the submitted {mri_type.capitalize()} MRI scan. The classification output indicates <b>{prediction_class}</b> with a confidence of <b>{confidence * 100:.2f}%</b>."
    story.append(Paragraph(result_text, body_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Spatial Abnormality Localization (Grad-CAM)", section_title_style))
    story.append(Paragraph("Below is the side-by-side comparison of the original MRI and the Grad-CAM visual activation map. The heatmap overlays indicate the structural boundaries (red focus areas) that contributed most to the model staging choice.", body_style))
    story.append(Spacer(1, 10))
    
    img_width = 180
    img_height = 180
    
    orig_abs_path = os.path.join(STATIC_DIR, image_rel_path.lstrip("/static/").lstrip("/"))
    heat_abs_path = os.path.join(STATIC_DIR, heatmap_rel_path.lstrip("/static/").lstrip("/"))
    
    image_elements = []
    
    if os.path.exists(orig_abs_path):
        try:
            image_elements.append(Image(orig_abs_path, width=img_width, height=img_height))
        except Exception:
            image_elements.append(Paragraph("[Original Image Render Failed]", body_style))
    else:
        image_elements.append(Paragraph("[Original Image Not Found]", body_style))
        
    if os.path.exists(heat_abs_path):
        try:
            image_elements.append(Image(heat_abs_path, width=img_width, height=img_height))
        except Exception:
            image_elements.append(Paragraph("[Grad-CAM Heatmap Render Failed]", body_style))
    else:
        image_elements.append(Paragraph("[Grad-CAM Heatmap Not Found]", body_style))
        
    img_table_data = [[image_elements[0], image_elements[1]]]
    img_table = Table(img_table_data, colWidths=[270, 270])
    img_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    
    story.append(img_table)
    
    # Force Page Break to split diagnostics from reference guides
    story.append(PageBreak())
    
    # ---------------- PAGE 2: CLINICAL REFERENCE GUIDE ----------------
    story.append(Paragraph("NEUROSCAN AI", title_style))
    story.append(Paragraph("CLINICAL PATHOLOGICAL REFERENCE GUIDE", subtitle_style))
    
    ref_key = prediction_class.lower()
    disease_description = DISEASE_REFERENCES.get(ref_key, (
        "<b>Disease Classification & Pathological Overview:</b><br/>"
        "No detailed clinical reference guide is registered for this specific class. "
        "Please consult standard clinical radiology references for diagnostic assistance."
    ))
    
    story.append(Paragraph(disease_description, body_style))
    story.append(Spacer(1, 20))
    
    # Signatures block at the bottom of Page 2
    qr_drawing = Drawing(50, 50)
    qr_drawing.add(Rect(0, 0, 50, 50, fillColor=colors.HexColor("#0F172A"), strokeColor=None))
    qr_drawing.add(Rect(8, 8, 34, 34, fillColor=colors.white, strokeColor=None))
    qr_drawing.add(Rect(16, 16, 18, 18, fillColor=colors.HexColor("#0F172A"), strokeColor=None))
    
    sig_drawing = Drawing(120, 30)
    sig_drawing.add(String(10, 10, f"{doctor_name}", fontName="Times-Italic", fontSize=12, fillColor=colors.HexColor("#2563EB")))
    sig_drawing.add(Rect(0, 2, 120, 0.5, fillColor=colors.HexColor("#94A3B8")))
    
    footer_data = [
        [qr_drawing, "", sig_drawing],
        [Paragraph("Verification QR Code", meta_val_style), "", Paragraph("Neuro-Radiologist Signature", meta_val_style)]
    ]
    
    footer_table = Table(footer_data, colWidths=[120, 300, 120])
    footer_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 1), (-1, 1), 3),
    ]))
    
    story.append(KeepTogether([footer_table]))
    
    doc.build(story)
