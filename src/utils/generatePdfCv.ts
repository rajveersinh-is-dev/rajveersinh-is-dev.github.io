import { jsPDF } from 'jspdf';
import {
  profileData,
  educationData,
  achievementsData,
  publicationsData,
  projectsData,
  skillsData,
  experienceData,
  contactData,
} from '../data';

/**
 * Generates an authoritative, professionally formatted academic CV PDF.
 * Uses only local vector drawing and typography from jsPDF. Zero external font or API calls.
 */
export function buildCvDocument(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper functions
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      renderPageHeader();
    }
  };

  const renderPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `${profileData.fullName} — Curriculum Vitae | Page ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      25,
      { align: 'right' }
    );
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, 30, pageWidth - margin, 30);
  };

  const renderSectionHeader = (title: string) => {
    checkPageBreak(35);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 24, 33);
    doc.text(title.toUpperCase(), margin, y);

    // Accent line
    doc.setDrawColor(217, 119, 6); // Amber-600
    doc.setLineWidth(1.2);
    doc.line(margin, y + 4, margin + 28, y + 4);

    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.5);
    doc.line(margin + 32, y + 4, pageWidth - margin, y + 4);
    y += 16;
  };

  // Header Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(profileData.fullName, margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(217, 119, 6); // Amber
  doc.text(`${profileData.professionalIdentity} (Age: ${profileData.age})`, margin, y);
  y += 14;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${profileData.location}  |  Email: ${contactData.email}  |  GitHub: github.com/rajveersinh-is-dev`,
    margin,
    y
  );
  y += 12;
  doc.text(
    `ORCID: 0009-0004-7838-4064  |  Kaggle: kaggle.com/rajveerpardeshi  |  LinkedIn: linkedin.com/in/rajveer-pardeshi-6bb944401`,
    margin,
    y
  );
  y += 14;

  doc.setDrawColor(200, 205, 215);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Statement / Objective
  renderSectionHeader('Research Profile & Philosophy');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const aboutLines = doc.splitTextToSize(profileData.about, contentWidth);
  doc.text(aboutLines, margin, y);
  y += aboutLines.length * 11 + 4;

  // Education
  renderSectionHeader('Education');
  educationData.forEach((edu) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(edu.institution, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(edu.status, pageWidth - margin, y, { align: 'right' });
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(edu.programmeOrStage, margin + 8, y);
    y += 14;
  });

  // Research Preprints
  renderSectionHeader('Research & Preprints');
  publicationsData.forEach((pub) => {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${pub.status}] ${pub.title}`, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const absLines = doc.splitTextToSize(`Area: ${pub.researchArea}. ${pub.shortAbstract}`, contentWidth - 10);
    doc.text(absLines, margin + 8, y);
    y += absLines.length * 10 + 2;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(217, 119, 6);
    doc.text(`Record: ${pub.recordUrl}`, margin + 8, y);
    y += 14;
  });

  // Selected Projects & Research Systems
  renderSectionHeader('Computational & Research Projects');
  projectsData.forEach((proj) => {
    checkPageBreak(38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${proj.name} — ${proj.category}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`[${proj.technologies.slice(0, 4).join(', ')}]`, pageWidth - margin, y, { align: 'right' });
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(proj.conciseDescription, contentWidth - 8);
    doc.text(descLines, margin + 8, y);
    y += descLines.length * 10 + 6;
  });

  // Achievements
  renderSectionHeader('Honors & Achievements');
  achievementsData.forEach((ach) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(ach.title, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const achLines = doc.splitTextToSize(`${ach.description} ${ach.details}`, contentWidth - 8);
    doc.text(achLines, margin + 8, y);
    y += achLines.length * 10 + 6;
  });

  // Technical Competencies
  renderSectionHeader('Technical Skills (Intermediate Proficiency)');
  skillsData.forEach((cat) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(217, 119, 6);
    doc.text(`${cat.categoryName}:`, margin, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const skillsList = cat.skills.map((s) => `${s.name} (${s.associatedTopics.slice(0, 3).join(', ')})`).join('  •  ');
    const skillLines = doc.splitTextToSize(skillsList, contentWidth - 8);
    doc.text(skillLines, margin + 8, y);
    y += skillLines.length * 10 + 4;
  });

  // Experience
  renderSectionHeader('Practical & Technical Experience');
  experienceData.forEach((exp) => {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.role} — ${exp.organization} (${exp.subsidiaryOrFamilyBusiness})`, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    exp.responsibilities.forEach((resp) => {
      const respLines = doc.splitTextToSize(`• ${resp}`, contentWidth - 12);
      doc.text(respLines, margin + 8, y);
      y += respLines.length * 10;
    });
    y += 4;
  });

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Rajveersinh Vishal Pardeshi — Curriculum Vitae | Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Triggers a client-side download of the generated PDF CV.
 */
export function downloadPdfCv(filename = 'Rajveersinh_Vishal_Pardeshi_CV.pdf') {
  const doc = buildCvDocument();
  doc.save(filename);
}
