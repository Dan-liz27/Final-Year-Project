import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import diseaseData from '../data/diseaseInfo.json';

export default function PredictionExport({ prediction, imageUrl, confidence }) {
    const [isExporting, setIsExporting] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const generatePDF = async () => {
        setIsExporting(true);

        try {
            // Get disease information
            const diseaseInfo = diseaseData[prediction] || {
                description: "Information not available for this condition.",
                severity: "unknown",
                symptoms: ["Information not available"],
                treatment: "Please consult a healthcare professional.",
                whenToSeeDoctor: "If you have concerns about this condition."
            };

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = 0;

            // ===== HEADER SECTION =====
            // Gradient-style header background
            pdf.setFillColor(6, 182, 212); // Cyan
            pdf.rect(0, 0, pageWidth, 50, 'F');

            // Add decorative accent bar
            pdf.setFillColor(59, 130, 246); // Blue
            pdf.rect(0, 45, pageWidth, 5, 'F');

            // Logo/Icon placeholder (medical cross)
            pdf.setFillColor(255, 255, 255);
            pdf.circle(pageWidth / 2, 20, 8, 'F');
            pdf.setFillColor(6, 182, 212);
            pdf.rect(pageWidth / 2 - 1, 14, 2, 12, 'F'); // Vertical bar
            pdf.rect(pageWidth / 2 - 5, 19, 10, 2, 'F'); // Horizontal bar

            // Title
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(26);
            pdf.setFont('helvetica', 'bold');
            pdf.text('SKIN DISEASE ANALYSIS REPORT', pageWidth / 2, 38, { align: 'center' });

            yPosition = 60;

            // ===== REPORT INFO BAR =====
            pdf.setFillColor(248, 250, 252); // Light gray background
            pdf.rect(0, yPosition, pageWidth, 15, 'F');

            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const reportDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            pdf.text(`Report Generated: ${reportDate}`, margin, yPosition + 10);
            pdf.text(`Report ID: ${Date.now().toString().slice(-8)}`, pageWidth - margin, yPosition + 10, { align: 'right' });

            yPosition += 25;

            // ===== PREDICTION RESULT SECTION =====
            // Section header
            pdf.setFillColor(241, 245, 249);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
            pdf.setTextColor(30, 41, 59);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('DIAGNOSIS PREDICTION', margin + 3, yPosition + 6);

            yPosition += 15;

            // Main prediction box with border
            pdf.setDrawColor(6, 182, 212);
            pdf.setLineWidth(0.5);
            pdf.setFillColor(240, 249, 255);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 4, 4, 'FD');

            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Predicted Condition:', margin + 5, yPosition + 10);

            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(6, 182, 212);
            const predictionText = pdf.splitTextToSize(prediction, pageWidth - 2 * margin - 15);
            pdf.text(predictionText, margin + 5, yPosition + 22);

            yPosition += 45;

            // ===== CONFIDENCE SECTION =====
            pdf.setFillColor(241, 245, 249);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
            pdf.setTextColor(30, 41, 59);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('CONFIDENCE ANALYSIS', margin + 3, yPosition + 6);

            yPosition += 15;

            const confidencePercent = (confidence * 100).toFixed(1);
            const confColor = confidence >= 0.9 ? [34, 197, 94] : confidence >= 0.7 ? [251, 191, 36] : [239, 68, 68];
            const confLabel = confidence >= 0.9 ? 'High Confidence' : confidence >= 0.7 ? 'Medium Confidence' : 'Low Confidence';

            // Confidence box
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.3);
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 4, 4, 'FD');

            // Confidence percentage (large)
            pdf.setFontSize(32);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...confColor);
            pdf.text(`${confidencePercent}%`, margin + 10, yPosition + 20);

            // Confidence label
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(71, 85, 105);
            pdf.text(confLabel, margin + 10, yPosition + 27);

            // Visual confidence bar
            const barX = margin + 70;
            const barY = yPosition + 10;
            const barWidth = pageWidth - 2 * margin - 80;
            const barHeight = 12;

            // Background bar
            pdf.setFillColor(229, 231, 235);
            pdf.roundedRect(barX, barY, barWidth, barHeight, 3, 3, 'F');

            // Filled bar
            pdf.setFillColor(...confColor);
            const fillWidth = (barWidth * confidence);
            if (fillWidth > 0) {
                pdf.roundedRect(barX, barY, fillWidth, barHeight, 3, 3, 'F');
            }

            // Percentage text on bar
            pdf.setFontSize(9);
            pdf.setTextColor(255, 255, 255);
            if (confidence > 0.15) {
                pdf.text(`${confidencePercent}%`, barX + fillWidth - 15, barY + 8);
            }

            yPosition += 40;

            // ===== ANALYZED IMAGE SECTION =====
            if (imageUrl) {
                try {
                    // Check if we need a new page for the image
                    if (yPosition > pageHeight - 130) {
                        pdf.addPage();
                        yPosition = margin;
                    }

                    pdf.setFillColor(241, 245, 249);
                    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
                    pdf.setTextColor(30, 41, 59);
                    pdf.setFontSize(11);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('ANALYZED IMAGE', margin + 3, yPosition + 6);

                    yPosition += 15;

                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = imageUrl;

                    await new Promise((resolve) => {
                        img.onload = resolve;
                    });

                    // Calculate image dimensions to fit nicely
                    const maxImgWidth = pageWidth - 2 * margin - 20;
                    const maxImgHeight = 80; // Reduced from 100 for better spacing
                    let imgWidth = maxImgWidth;
                    let imgHeight = (img.height / img.width) * imgWidth;

                    if (imgHeight > maxImgHeight) {
                        imgHeight = maxImgHeight;
                        imgWidth = (img.width / img.height) * imgHeight;
                    }

                    // Center the image
                    const imgX = (pageWidth - imgWidth) / 2;

                    // Image border
                    pdf.setDrawColor(203, 213, 225);
                    pdf.setLineWidth(0.5);
                    pdf.setFillColor(255, 255, 255);
                    pdf.roundedRect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 4, 4, 'FD');

                    pdf.addImage(imageUrl, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 20; // Increased spacing after image
                } catch (error) {
                    console.error('Error adding image to PDF:', error);
                }
            }

            // ===== DISEASE INFORMATION SECTION =====
            // Always start disease info on a new page for better layout
            pdf.addPage();
            yPosition = margin;

            // Section header
            pdf.setFillColor(241, 245, 249);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
            pdf.setTextColor(30, 41, 59);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('CONDITION INFORMATION', margin + 3, yPosition + 6);

            yPosition += 15;

            // Description box - calculate height first, then draw
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const descriptionLines = pdf.splitTextToSize(diseaseInfo.description, pageWidth - 2 * margin - 15);
            const descHeight = descriptionLines.length * 4 + 18;

            // Draw box background
            pdf.setDrawColor(203, 213, 225);
            pdf.setLineWidth(0.3);
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, descHeight, 4, 4, 'FD');

            // Add text on top
            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Description:', margin + 5, yPosition + 8);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(51, 65, 85);
            pdf.text(descriptionLines, margin + 5, yPosition + 15);

            yPosition += descHeight + 8;

            // Severity badge
            const severityColors = {
                high: { bg: [254, 226, 226], text: [153, 27, 27], label: 'HIGH RISK' },
                medium: { bg: [254, 243, 199], text: [146, 64, 14], label: 'MEDIUM RISK' },
                low: { bg: [220, 252, 231], text: [22, 101, 52], label: 'LOW RISK' },
                none: { bg: [219, 234, 254], text: [30, 64, 175], label: 'NO RISK' },
                unknown: { bg: [243, 244, 246], text: [75, 85, 99], label: 'UNKNOWN' }
            };

            const sevConfig = severityColors[diseaseInfo.severity] || severityColors.unknown;

            pdf.setFillColor(...sevConfig.bg);
            pdf.roundedRect(margin, yPosition, 50, 8, 2, 2, 'F');
            pdf.setTextColor(...sevConfig.text);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text(sevConfig.label, margin + 25, yPosition + 5.5, { align: 'center' });

            yPosition += 15;

            // Symptoms section
            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Common Symptoms:', margin, yPosition);

            yPosition += 7;

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 65, 85);

            diseaseInfo.symptoms.forEach((symptom) => {
                // Bullet point
                pdf.setFillColor(6, 182, 212);
                pdf.circle(margin + 3, yPosition - 1, 1, 'F');

                const symptomLines = pdf.splitTextToSize(symptom, pageWidth - 2 * margin - 15);
                pdf.text(symptomLines, margin + 8, yPosition);
                yPosition += symptomLines.length * 4 + 2;
            });

            yPosition += 5;

            // Treatment section
            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Recommended Treatment:', margin, yPosition);

            yPosition += 7;

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 65, 85);
            const treatmentLines = pdf.splitTextToSize(diseaseInfo.treatment, pageWidth - 2 * margin - 10);
            pdf.text(treatmentLines, margin + 5, yPosition);
            yPosition += treatmentLines.length * 4 + 8;

            // When to see doctor section (highlighted box)
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = margin;
            }

            // Calculate height first
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const doctorLines = pdf.splitTextToSize(diseaseInfo.whenToSeeDoctor, pageWidth - 2 * margin - 15);
            const doctorHeight = doctorLines.length * 4 + 18;

            // Draw box background
            pdf.setDrawColor(59, 130, 246);
            pdf.setLineWidth(0.5);
            pdf.setFillColor(239, 246, 255);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, doctorHeight, 4, 4, 'FD');

            // Add text on top
            pdf.setTextColor(30, 64, 175);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('When to See a Doctor:', margin + 5, yPosition + 8);

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(37, 99, 235);
            pdf.text(doctorLines, margin + 5, yPosition + 15);

            yPosition += doctorHeight + 10;

            // ===== DISCLAIMER SECTION =====
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                yPosition = margin;
            }

            // Warning icon and disclaimer
            pdf.setDrawColor(251, 191, 36);
            pdf.setLineWidth(1);
            pdf.setFillColor(254, 252, 232);
            pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 4, 4, 'FD');

            // Warning triangle
            pdf.setFillColor(251, 191, 36);
            pdf.triangle(margin + 8, yPosition + 15, margin + 5, yPosition + 10, margin + 11, yPosition + 10, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('!', margin + 8, yPosition + 14);

            pdf.setTextColor(146, 64, 14);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('IMPORTANT MEDICAL DISCLAIMER', margin + 18, yPosition + 10);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(120, 53, 15);
            const disclaimerText = 'This AI-powered analysis is provided for educational and informational purposes only. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified dermatologist or healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided by this tool.';
            const splitDisclaimer = pdf.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 25);
            pdf.text(splitDisclaimer, margin + 18, yPosition + 18);

            yPosition += 50;

            // ===== FOOTER =====
            // Decorative line
            pdf.setDrawColor(203, 213, 225);
            pdf.setLineWidth(0.3);
            pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

            // Footer text
            pdf.setTextColor(148, 163, 184);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Skin Disease Classifier', margin, pageHeight - 12);
            pdf.text('Powered by Advanced AI Technology', pageWidth / 2, pageHeight - 12, { align: 'center' });
            pdf.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 12, { align: 'right' });

            // Save PDF
            const filename = `SkinAnalysis_${prediction.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
            pdf.save(filename);

            toast.success('Professional PDF downloaded successfully!', {
                icon: '📄',
                duration: 3000
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const copyToClipboard = () => {
        const shareText = `Skin Disease Analysis Result:\n\nPredicted Disease: ${prediction}\nConfidence: ${(confidence * 100).toFixed(2)}%\n\nGenerated by Skin Disease Classifier`;

        navigator.clipboard.writeText(shareText).then(() => {
            toast.success('Copied to clipboard!', {
                icon: '📋',
                duration: 2000
            });
            setShowShareMenu(false);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent('Skin Disease Analysis Result');
        const body = encodeURIComponent(
            `Skin Disease Analysis Result:\n\n` +
            `Predicted Disease: ${prediction}\n` +
            `Confidence: ${(confidence * 100).toFixed(2)}%\n\n` +
            `Note: This is an AI prediction for educational purposes only. Please consult a qualified dermatologist for proper medical diagnosis.`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
        setShowShareMenu(false);
    };

    return (
        <div className="flex gap-2 relative">
            {/* PDF Export Button */}
            <button
                onClick={generatePDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as PDF"
            >
                {isExporting ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF</span>
                    </>
                )}
            </button>

            {/* Share Button */}
            <div className="relative">
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    title="Share Results"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-10">
                        <button
                            onClick={copyToClipboard}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-200 rounded-t-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy to Clipboard
                        </button>
                        <button
                            onClick={shareViaEmail}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-200 rounded-b-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Share via Email
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside to close share menu */}
            {showShareMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowShareMenu(false)}
                />
            )}
        </div>
    );
}
