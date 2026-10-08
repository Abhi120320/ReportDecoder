import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FileUpload from '../components/FileUpload'
import ResultsCards from '../components/ResultsCards'
import type { AnalysisResponse } from '../lib/types'

// Mock the props and internal calls for FileUpload
describe('FileUpload Component', () => {
  it('renders upload component successfully', () => {
    const setFile = vi.fn()
    
    render(<FileUpload file={null} onFileSelect={setFile} onClear={setFile} />)
    
    expect(screen.getByText(/Drop your medical report/i)).toBeInTheDocument()
  })
})

describe('ResultsCards Component', () => {
  it('renders lab-value chip correctly with icon and text', () => {
    const dummyResult: AnalysisResponse = {
      summary: "Test summary",
      document_type: "lab_report",
      medicines: [],
      lab_values: [
        {
          name: "Hemoglobin",
          value: "10.2",
          normal_range: "12-15",
          status: "low",
          meaning: "Low blood count"
        }
      ],
      red_flags: [],
      doctor_questions: [],
      disclaimer: "Disclaimer"
    }

    render(<ResultsCards data={dummyResult} />)
    
    expect(screen.getByText('Hemoglobin')).toBeInTheDocument()
    expect(screen.getByText('10.2')).toBeInTheDocument()
    // It should render text label "Low"
    expect(screen.getByText('Low')).toBeInTheDocument()
  })
})
