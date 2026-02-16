/**
 * PPTX Exporter (순수 클라이언트 사이드)
 * JSZip을 사용해서 PPTX 파일 구조를 직접 생성
 * PPTX는 ZIP 파일이며, 각 슬라이드는 이미지로 삽입
 */

import JSZip from "jszip";
import { BaseExporter } from "../core/Exporter";
import type { RenderedSlide } from "../types";

export class PptxExporter extends BaseExporter {
  private zip: JSZip | null = null;
  private slideWidth = 10; // inches (16:9 기준)
  private slideHeight = 5.625; // inches

  protected async initialize(): Promise<void> {
    this.zip = new JSZip();
  }

  protected async createFile(slides: RenderedSlide[]): Promise<Blob> {
    if (!this.zip) {
      throw new Error("Exporter not initialized");
    }

    // PPTX 구조 생성
    this.addContentTypes(slides.length);
    this.addRels();
    this.addPresentationXml(slides.length);
    this.addPresentationRels(slides.length);

    // 각 슬라이드 추가
    for (let i = 0; i < slides.length; i++) {
      await this.addSlide(slides[i], i);
    }

    // ZIP 생성
    return await this.zip.generateAsync({ type: "blob" });
  }

  protected async finalize(): Promise<void> {
    this.zip = null;
  }

  /**
   * [Content_Types].xml 생성
   */
  private addContentTypes(slideCount: number): void {
    let slideParts = "";
    for (let i = 1; i <= slideCount; i++) {
      slideParts += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${slideParts}
</Types>`;

    this.zip!.file("[Content_Types].xml", xml);
  }

  /**
   * _rels/.rels 생성
   */
  private addRels(): void {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

    this.zip!.file("_rels/.rels", xml);
  }

  /**
   * ppt/presentation.xml 생성
   */
  private addPresentationXml(slideCount: number): void {
    let slideIds = "";
    for (let i = 1; i <= slideCount; i++) {
      slideIds += `<p:sldId id="${255 + i}" r:id="rId${i}"/>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>
    ${slideIds}
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;

    this.zip!.file("ppt/presentation.xml", xml);
  }

  /**
   * ppt/_rels/presentation.xml.rels 생성
   */
  private addPresentationRels(slideCount: number): void {
    let relationships = "";
    for (let i = 1; i <= slideCount; i++) {
      relationships += `<Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${relationships}
</Relationships>`;

    this.zip!.file("ppt/_rels/presentation.xml.rels", xml);
  }

  /**
   * 개별 슬라이드 추가
   */
  private async addSlide(slide: RenderedSlide, index: number): Promise<void> {
    const slideNum = index + 1;

    // 이미지를 PNG Blob으로 변환
    const imageBlob = this.renderer.dataURLToBlob(slide.imageData);
    this.zip!.file(`ppt/media/image${slideNum}.png`, imageBlob);

    // slide.xml 생성
    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="Image ${slideNum}"/>
          <p:cNvPicPr>
            <a:picLocks noChangeAspect="1"/>
          </p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId1"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="9144000" cy="5143500"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;

    this.zip!.file(`ppt/slides/slide${slideNum}.xml`, slideXml);

    // slide rels 생성
    const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${slideNum}.png"/>
</Relationships>`;

    this.zip!.file(`ppt/slides/_rels/slide${slideNum}.xml.rels`, slideRels);
  }

  /**
   * 내보내기 및 자동 다운로드
   */
  async exportAndDownload(slideElements: HTMLElement[]): Promise<void> {
    const result = await this.export(slideElements);
    if (result.success && result.blob) {
      this.downloadBlob(result.blob, `${this.options.fileName}.pptx`);
    }
  }
}
