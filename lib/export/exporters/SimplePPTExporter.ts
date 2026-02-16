/**
 * Simple PowerPoint Exporter
 * 각 섹션을 이미지로 캡처하여 PPT 슬라이드에 삽입하는 방식
 * - 완전 오프라인 작동
 * - 100% PowerPoint 호환
 * - UB 없음, npm 의존성 최소
 */

import type {
  Exporter,
  CapturedSection,
  ExportOptions,
  ExportProgress,
  ExportResult,
} from "../core/types";

export class SimplePPTExporter implements Exporter {
  async export(
    sections: CapturedSection[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    const startTime = Date.now();

    try {
      // JSZip을 동적으로 로딩
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const slideCount = sections.length;

      if (onProgress) {
        onProgress({
          current: 0,
          total: slideCount,
          status: "generating",
          message: "PPT 구조 생성 중...",
          percentage: 0,
        });
      }

      // 1. [Content_Types].xml
      zip.file("[Content_Types].xml", this.generateContentTypes(slideCount));

      // 2. _rels/.rels
      zip.folder("_rels")?.file(".rels", this.generateRootRels());

      // 3. ppt 폴더 구조
      const ppt = zip.folder("ppt");
      const slides = ppt?.folder("slides");
      const slideRels = slides?.folder("_rels");
      const media = ppt?.folder("media");
      const pptRels = ppt?.folder("_rels");

      // 슬라이드 마스터 및 레이아웃 폴더
      const slideMasters = ppt?.folder("slideMasters");
      const slideMastersRels = slideMasters?.folder("_rels");
      const slideLayouts = ppt?.folder("slideLayouts");
      const slideLayoutsRels = slideLayouts?.folder("_rels");
      const themes = ppt?.folder("theme");

      // 4. presentation.xml
      ppt?.file("presentation.xml", this.generatePresentation(slideCount, options));

      // 5. presentation.xml.rels
      pptRels?.file("presentation.xml.rels", this.generatePresentationRels(slideCount));

      // 6. Slide Master
      slideMasters?.file("slideMaster1.xml", this.generateSlideMaster());
      slideMastersRels?.file("slideMaster1.xml.rels", this.generateSlideMasterRels());

      // 7. Slide Layout
      slideLayouts?.file("slideLayout1.xml", this.generateSlideLayout());
      slideLayoutsRels?.file("slideLayout1.xml.rels", this.generateSlideLayoutRels());

      // 8. Theme
      themes?.file("theme1.xml", this.generateTheme());

      // 9. 각 슬라이드 생성
      for (let i = 0; i < slideCount; i++) {
        const slideNum = i + 1;
        const section = sections[i];

        if (onProgress) {
          onProgress({
            current: slideNum,
            total: slideCount,
            status: "generating",
            message: `슬라이드 ${slideNum}/${slideCount} 생성 중...`,
            percentage: Math.round((slideNum / slideCount) * 90), // 90%까지
          });
        }

        // 슬라이드 XML
        slides?.file(`slide${slideNum}.xml`, this.generateSlide(slideNum));

        // 슬라이드 관계
        slideRels?.file(`slide${slideNum}.xml.rels`, this.generateSlideRels(slideNum));

        // 이미지 추가
        const imageBlob = this.base64ToBlob(section.imageData);
        media?.file(`image${slideNum}.png`, imageBlob);
      }

      // 10. ZIP 생성
      if (onProgress) {
        onProgress({
          current: slideCount,
          total: slideCount,
          status: "generating",
          message: "PPT 파일 생성 중...",
          percentage: 95,
        });
      }

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      // 11. 파일 다운로드
      const fileName = this.generateFileName(options.fileName);
      this.downloadBlob(blob, fileName);

      if (onProgress) {
        onProgress({
          current: slideCount,
          total: slideCount,
          status: "completed",
          message: "PowerPoint 내보내기 완료!",
          percentage: 100,
        });
      }

      // 성공 결과 반환
      const duration = Date.now() - startTime;
      return {
        success: true,
        stats: {
          totalSections: slideCount,
          capturedSections: slideCount,
          failedSections: 0,
          fileSize: blob.size,
          duration,
        },
      };
    } catch (error) {
      console.error("PPT 내보내기 실패:", error);

      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      // 에러 결과 반환
      return {
        success: false,
        error: {
          type: "generation_failed",
          message: `PowerPoint 내보내기 실패: ${errorMessage}`,
          details: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
        },
        stats: {
          totalSections: sections.length,
          capturedSections: 0,
          failedSections: sections.length,
          duration,
        },
      };
    }
  }

  /**
   * [Content_Types].xml 생성
   */
  private generateContentTypes(slideCount: number): string {
    const slideOverrides = Array.from(
      { length: slideCount },
      (_, i) =>
        `    <Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Default Extension="png" ContentType="image/png"/>
    <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
    <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
    <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
    <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
${slideOverrides}
</Types>`;
  }

  /**
   * _rels/.rels 생성
   */
  private generateRootRels(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
  }

  /**
   * presentation.xml 생성
   */
  private generatePresentation(slideCount: number, options: ExportOptions): string {
    const ratio = options.aspectRatio || { width: 16, height: 9 };

    // PowerPoint 단위: EMU (English Metric Units)
    // 1 inch = 914400 EMU
    // 기본: 10" x 5.625" (16:9)
    const width = 9144000;
    const height = Math.round((width * ratio.height) / ratio.width);

    const slideIds = Array.from(
      { length: slideCount },
      (_, i) => `        <p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:sldMasterIdLst>
        <p:sldMasterId id="2147483648" r:id="rId1"/>
    </p:sldMasterIdLst>
    <p:sldIdLst>
${slideIds}
    </p:sldIdLst>
    <p:sldSz cx="${width}" cy="${height}"/>
    <p:notesSz cx="6858000" cy="9144000"/>
    <p:defaultTextStyle/>
</p:presentation>`;
  }

  /**
   * presentation.xml.rels 생성
   */
  private generatePresentationRels(slideCount: number): string {
    const slideRels = Array.from(
      { length: slideCount },
      (_, i) =>
        `    <Relationship Id="rId${i + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
${slideRels}
</Relationships>`;
  }

  /**
   * slide.xml 생성 (이미지 하나만 포함)
   */
  private generateSlide(slideNum: number): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
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
                    <p:cNvPr id="2" name="Slide ${slideNum} Image"/>
                    <p:cNvPicPr>
                        <a:picLocks noChangeAspect="1"/>
                    </p:cNvPicPr>
                    <p:nvPr/>
                </p:nvPicPr>
                <p:blipFill>
                    <a:blip r:embed="rId2"/>
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
  }

  /**
   * slide.xml.rels 생성
   */
  private generateSlideRels(slideNum: number): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${slideNum}.png"/>
</Relationships>`;
  }

  /**
   * Base64 이미지를 Blob으로 변환
   */
  private base64ToBlob(base64Data: string): Blob {
    const base64 = base64Data.split(",")[1];
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: "image/png" });
  }

  /**
   * 파일명 생성
   */
  private generateFileName(customName: string | undefined): string {
    if (customName) {
      return customName.endsWith(".pptx") ? customName : `${customName}.pptx`;
    }

    const date = new Date();
    const dateString = date.toISOString().split("T")[0];
    return `presentation-${dateString}.pptx`;
  }

  /**
   * Blob을 파일로 다운로드
   */
  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // 정리
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * slideMaster.xml 생성
   */
  private generateSlideMaster(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:cSld>
        <p:bg>
            <p:bgRef idx="1001">
                <a:schemeClr val="bg1"/>
            </p:bgRef>
        </p:bg>
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
        </p:spTree>
    </p:cSld>
    <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
    <p:sldLayoutIdLst>
        <p:sldLayoutId id="2147483649" r:id="rId1"/>
    </p:sldLayoutIdLst>
</p:sldMaster>`;
  }

  /**
   * slideMaster1.xml.rels 생성
   */
  private generateSlideMasterRels(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`;
  }

  /**
   * slideLayout.xml 생성
   */
  private generateSlideLayout(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
             type="blank" preserve="1">
    <p:cSld name="Blank">
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
        </p:spTree>
    </p:cSld>
    <p:clrMapOvr>
        <a:masterClrMapping/>
    </p:clrMapOvr>
</p:sldLayout>`;
  }

  /**
   * slideLayout1.xml.rels 생성
   */
  private generateSlideLayoutRels(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;
  }

  /**
   * theme.xml 생성
   */
  private generateTheme(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
    <a:themeElements>
        <a:clrScheme name="Office">
            <a:dk1>
                <a:sysClr val="windowText" lastClr="000000"/>
            </a:dk1>
            <a:lt1>
                <a:sysClr val="window" lastClr="FFFFFF"/>
            </a:lt1>
            <a:dk2>
                <a:srgbClr val="44546A"/>
            </a:dk2>
            <a:lt2>
                <a:srgbClr val="E7E6E6"/>
            </a:lt2>
            <a:accent1>
                <a:srgbClr val="4472C4"/>
            </a:accent1>
            <a:accent2>
                <a:srgbClr val="ED7D31"/>
            </a:accent2>
            <a:accent3>
                <a:srgbClr val="A5A5A5"/>
            </a:accent3>
            <a:accent4>
                <a:srgbClr val="FFC000"/>
            </a:accent4>
            <a:accent5>
                <a:srgbClr val="5B9BD5"/>
            </a:accent5>
            <a:accent6>
                <a:srgbClr val="70AD47"/>
            </a:accent6>
            <a:hlink>
                <a:srgbClr val="0563C1"/>
            </a:hlink>
            <a:folHlink>
                <a:srgbClr val="954F72"/>
            </a:folHlink>
        </a:clrScheme>
        <a:fontScheme name="Office">
            <a:majorFont>
                <a:latin typeface="Calibri Light" panose="020F0302020204030204"/>
                <a:ea typeface=""/>
                <a:cs typeface=""/>
            </a:majorFont>
            <a:minorFont>
                <a:latin typeface="Calibri" panose="020F0502020204030204"/>
                <a:ea typeface=""/>
                <a:cs typeface=""/>
            </a:minorFont>
        </a:fontScheme>
        <a:fmtScheme name="Office">
            <a:fillStyleLst>
                <a:solidFill>
                    <a:schemeClr val="phClr"/>
                </a:solidFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0">
                            <a:schemeClr val="phClr">
                                <a:lumMod val="110000"/>
                                <a:satMod val="105000"/>
                                <a:tint val="67000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="50000">
                            <a:schemeClr val="phClr">
                                <a:lumMod val="105000"/>
                                <a:satMod val="103000"/>
                                <a:tint val="73000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="100000">
                            <a:schemeClr val="phClr">
                                <a:lumMod val="105000"/>
                                <a:satMod val="109000"/>
                                <a:tint val="81000"/>
                            </a:schemeClr>
                        </a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0">
                            <a:schemeClr val="phClr">
                                <a:satMod val="103000"/>
                                <a:lumMod val="102000"/>
                                <a:tint val="94000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="50000">
                            <a:schemeClr val="phClr">
                                <a:satMod val="110000"/>
                                <a:lumMod val="100000"/>
                                <a:shade val="100000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="100000">
                            <a:schemeClr val="phClr">
                                <a:lumMod val="99000"/>
                                <a:satMod val="120000"/>
                                <a:shade val="78000"/>
                            </a:schemeClr>
                        </a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
            </a:fillStyleLst>
            <a:lnStyleLst>
                <a:ln w="6350" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill>
                        <a:schemeClr val="phClr"/>
                    </a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
                <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill>
                        <a:schemeClr val="phClr"/>
                    </a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
                <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">
                    <a:solidFill>
                        <a:schemeClr val="phClr"/>
                    </a:solidFill>
                    <a:prstDash val="solid"/>
                    <a:miter lim="800000"/>
                </a:ln>
            </a:lnStyleLst>
            <a:effectStyleLst>
                <a:effectStyle>
                    <a:effectLst/>
                </a:effectStyle>
                <a:effectStyle>
                    <a:effectLst/>
                </a:effectStyle>
                <a:effectStyle>
                    <a:effectLst>
                        <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
                            <a:srgbClr val="000000">
                                <a:alpha val="63000"/>
                            </a:srgbClr>
                        </a:outerShdw>
                    </a:effectLst>
                </a:effectStyle>
            </a:effectStyleLst>
            <a:bgFillStyleLst>
                <a:solidFill>
                    <a:schemeClr val="phClr"/>
                </a:solidFill>
                <a:solidFill>
                    <a:schemeClr val="phClr">
                        <a:tint val="95000"/>
                        <a:satMod val="170000"/>
                    </a:schemeClr>
                </a:solidFill>
                <a:gradFill rotWithShape="1">
                    <a:gsLst>
                        <a:gs pos="0">
                            <a:schemeClr val="phClr">
                                <a:tint val="93000"/>
                                <a:satMod val="150000"/>
                                <a:shade val="98000"/>
                                <a:lumMod val="102000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="50000">
                            <a:schemeClr val="phClr">
                                <a:tint val="98000"/>
                                <a:satMod val="130000"/>
                                <a:shade val="90000"/>
                                <a:lumMod val="103000"/>
                            </a:schemeClr>
                        </a:gs>
                        <a:gs pos="100000">
                            <a:schemeClr val="phClr">
                                <a:shade val="63000"/>
                                <a:satMod val="120000"/>
                            </a:schemeClr>
                        </a:gs>
                    </a:gsLst>
                    <a:lin ang="5400000" scaled="0"/>
                </a:gradFill>
            </a:bgFillStyleLst>
        </a:fmtScheme>
    </a:themeElements>
    <a:objectDefaults/>
    <a:extraClrSchemeLst/>
</a:theme>`;
  }
}
