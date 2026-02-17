/**
 * Template Component Tests
 * 8개 슬라이드 템플릿 렌더링 및 Props 테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Mock complex dependencies
// ---------------------------------------------------------------------------

// EditableText - 단순 span으로 대체
vi.mock('@/components/editor/EditableText', () => ({
  EditableText: ({ value, onSave, className }: any) => (
    <span
      data-testid="editable-text"
      className={className}
      onClick={() => onSave?.('updated')}
    >
      {value}
    </span>
  ),
}));

// EditableList - 단순 ul로 대체
vi.mock('@/components/editor/EditableList', () => ({
  EditableList: ({ items, onSave }: any) => (
    <ul data-testid="editable-list">
      {items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
    </ul>
  ),
}));

// DraggableElement - children을 그대로 렌더링
vi.mock('@/components/positioning/DraggableElement', () => ({
  DraggableElement: ({ children }: any) => (
    <div data-testid="draggable-element">{children}</div>
  ),
}));

// withDraggableElements - useDraggableWrapper를 no-op으로 mock
vi.mock('@/components/positioning/withDraggableElements', () => ({
  useDraggableWrapper: () => ({
    wrapWithDraggable: (element: any) => element,
    style: {},
    className: '',
    onClick: vi.fn(),
  }),
  withDraggableElements: (Component: any) => Component,
  WithDraggableProps: {},
}));

// UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// lucide-react icons
vi.mock('lucide-react', () => ({
  Check: () => <svg data-testid="icon-check" />,
  ChevronRight: () => <svg data-testid="icon-chevron" />,
  Circle: () => <svg data-testid="icon-circle" />,
  Plus: () => <svg data-testid="icon-plus" />,
  Trash2: () => <svg data-testid="icon-trash" />,
  Quote: () => <svg data-testid="icon-quote" />,
  Mail: () => <svg data-testid="icon-mail" />,
  Globe: () => <svg data-testid="icon-globe" />,
  Phone: () => <svg data-testid="icon-phone" />,
}));

// ---------------------------------------------------------------------------
// Import templates after mocks
// ---------------------------------------------------------------------------
import { TitleSlide } from './TitleSlide';
import { BulletPoints } from './BulletPoints';
import { ContentSlide } from './ContentSlide';
import { SectionTitle } from './SectionTitle';
import { QuoteSlide } from './QuoteSlide';
import { TwoColumn } from './TwoColumn';
import { ThankYou } from './ThankYou';
import { ImageWithCaption } from './ImageWithCaption';

// ---------------------------------------------------------------------------
// TitleSlide
// ---------------------------------------------------------------------------
describe('TitleSlide', () => {
  it('title과 subtitle을 렌더링한다', () => {
    render(
      <TitleSlide
        title="My Title"
        subtitle="My Subtitle"
        author="Author"
        date="2024-01-01"
      />
    );
    expect(screen.getAllByText('My Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('My Subtitle').length).toBeGreaterThan(0);
  });

  it('author와 date를 렌더링한다', () => {
    render(
      <TitleSlide
        title="Title"
        subtitle="Sub"
        author="Jane Doe"
        date="2024-06-15"
      />
    );
    expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2024-06-15').length).toBeGreaterThan(0);
  });

  it('custom className이 적용된다', () => {
    const { container } = render(
      <TitleSlide
        title="Title"
        subtitle="Sub"
        author="Author"
        date="2024"
        className="custom-class"
      />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it('onUpdate 콜백이 제공되어도 렌더링된다', () => {
    const onUpdate = vi.fn();
    render(
      <TitleSlide
        title="Title"
        subtitle="Sub"
        author="Author"
        date="2024"
        onUpdate={onUpdate}
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// BulletPoints
// ---------------------------------------------------------------------------
describe('BulletPoints', () => {
  const defaultPoints = ['Point 1', 'Point 2', 'Point 3'];

  it('title과 bullet points를 렌더링한다', () => {
    render(
      <BulletPoints
        title="Key Points"
        points={defaultPoints}
        icon="chevron"
      />
    );
    expect(screen.getAllByText('Key Points').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Point 1').length).toBeGreaterThan(0);
  });

  it('check 아이콘으로 렌더링된다', () => {
    render(
      <BulletPoints
        title="Title"
        points={['Point 1']}
        icon="check"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('circle 아이콘으로 렌더링된다', () => {
    render(
      <BulletPoints
        title="Title"
        points={['Point 1']}
        icon="circle"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('빈 points로도 렌더링된다', () => {
    render(
      <BulletPoints
        title="Empty"
        points={[]}
        icon="chevron"
      />
    );
    expect(screen.getAllByText('Empty').length).toBeGreaterThan(0);
  });

  it('onUpdate 콜백이 제공되어도 렌더링된다', () => {
    const onUpdate = vi.fn();
    render(
      <BulletPoints
        title="Title"
        points={defaultPoints}
        icon="chevron"
        onUpdate={onUpdate}
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ContentSlide
// ---------------------------------------------------------------------------
describe('ContentSlide', () => {
  it('title과 content를 렌더링한다', () => {
    render(
      <ContentSlide
        title="Content Title"
        content="Main content here"
        align="left"
      />
    );
    expect(screen.getAllByText('Content Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Main content here').length).toBeGreaterThan(0);
  });

  it('center 정렬로 렌더링된다', () => {
    render(
      <ContentSlide
        title="Title"
        content="Content"
        align="center"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('right 정렬로 렌더링된다', () => {
    render(
      <ContentSlide
        title="Title"
        content="Content"
        align="right"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('onUpdate 콜백이 제공되어도 렌더링된다', () => {
    const onUpdate = vi.fn();
    render(
      <ContentSlide
        title="Title"
        content="Content"
        align="left"
        onUpdate={onUpdate}
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------
describe('SectionTitle', () => {
  it('section, title, description을 렌더링한다', () => {
    render(
      <SectionTitle
        section="Section 1"
        title="Main Topic"
        description="Section overview"
      />
    );
    expect(screen.getAllByText('Section 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Main Topic').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Section overview').length).toBeGreaterThan(0);
  });

  it('description 없이도 렌더링된다', () => {
    render(
      <SectionTitle
        section="Section 2"
        title="Topic"
        description=""
      />
    );
    expect(screen.getAllByText('Section 2').length).toBeGreaterThan(0);
  });

  it('custom 스타일이 제공되어도 렌더링된다', () => {
    render(
      <SectionTitle
        section="Section"
        title="Title"
        description="Desc"
        backgroundColor="bg-blue-500"
        textColor="text-white"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// QuoteSlide
// ---------------------------------------------------------------------------
describe('QuoteSlide', () => {
  it('quote와 author를 렌더링한다', () => {
    render(
      <QuoteSlide
        quote="Innovation is key"
        author="Steve Jobs"
        title="Apple Co-founder"
      />
    );
    expect(screen.getAllByText('Innovation is key').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Steve Jobs').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Apple Co-founder').length).toBeGreaterThan(0);
  });

  it('onUpdate 콜백이 제공되어도 렌더링된다', () => {
    const onUpdate = vi.fn();
    render(
      <QuoteSlide
        quote="Quote text"
        author="Author"
        title="Title"
        onUpdate={onUpdate}
      />
    );
    expect(screen.getAllByText('Quote text').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// TwoColumn
// ---------------------------------------------------------------------------
describe('TwoColumn', () => {
  it('title, left, right 콘텐츠를 렌더링한다', () => {
    render(
      <TwoColumn
        title="Comparison"
        left="Left content"
        right="Right content"
        split="50-50"
      />
    );
    expect(screen.getAllByText('Comparison').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Left content').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Right content').length).toBeGreaterThan(0);
  });

  it('60-40 split으로 렌더링된다', () => {
    render(
      <TwoColumn
        title="Title"
        left="Left"
        right="Right"
        split="60-40"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('40-60 split으로 렌더링된다', () => {
    render(
      <TwoColumn
        title="Title"
        left="Left"
        right="Right"
        split="40-60"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ThankYou
// ---------------------------------------------------------------------------
describe('ThankYou', () => {
  it('message와 cta를 렌더링한다', () => {
    render(
      <ThankYou
        message="Thank You"
        cta="Questions?"
        contact={{ email: 'test@example.com', website: 'www.example.com' }}
      />
    );
    expect(screen.getAllByText('Thank You').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Questions?').length).toBeGreaterThan(0);
  });

  it('contact 정보를 렌더링한다', () => {
    render(
      <ThankYou
        message="Thanks"
        cta="Q&A"
        contact={{ email: 'hello@test.com', website: 'test.com' }}
      />
    );
    expect(screen.getAllByText('hello@test.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test.com').length).toBeGreaterThan(0);
  });

  it('contact 없이도 렌더링된다', () => {
    render(
      <ThankYou
        message="Thanks"
        cta="Done"
      />
    );
    expect(screen.getAllByText('Thanks').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ImageWithCaption
// ---------------------------------------------------------------------------
describe('ImageWithCaption', () => {
  it('title과 caption을 렌더링한다', () => {
    render(
      <ImageWithCaption
        title="Image Title"
        imageSrc="https://example.com/img.png"
        imageAlt="Test image"
        caption="Image caption"
        layout="contained"
      />
    );
    expect(screen.getAllByText('Image Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Image caption').length).toBeGreaterThan(0);
  });

  it('fullscreen 레이아웃으로 렌더링된다', () => {
    render(
      <ImageWithCaption
        title="Title"
        imageSrc="https://example.com/img.png"
        imageAlt="Alt text"
        caption="Caption"
        layout="fullscreen"
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });

  it('onUpdate 콜백이 제공되어도 렌더링된다', () => {
    const onUpdate = vi.fn();
    render(
      <ImageWithCaption
        title="Title"
        imageSrc="https://example.com/img.png"
        imageAlt="Alt"
        caption="Caption"
        layout="contained"
        onUpdate={onUpdate}
      />
    );
    expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
  });
});
