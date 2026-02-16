"use client";

import { SectionHeader, DataCard, SectionBadge } from "@/components/ui";
import { motion } from "framer-motion";

export default function TestComponents() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container-wide">
        {/* Page Title */}
        <div className="mb-16 text-center">
          <h1 className="text-hero mb-4">컴포넌트 테스트</h1>
          <p className="text-body-large text-muted-foreground">
            Apple × Palantir 디자인 시스템 컴포넌트 라이브러리
          </p>
        </div>

        {/* SectionHeader 테스트 */}
        <div className="mb-24">
          <h2 className="text-headline mb-8">1. SectionHeader</h2>

          <div className="space-y-12">
            {/* Center aligned */}
            <div className="p-8 bg-card border border-border rounded-2xl">
              <SectionHeader
                badge="Center Aligned"
                title="섹션 헤더 테스트"
                subtitle="배지, 제목, 부제목이 모두 포함된 헤더입니다"
                align="center"
              />
            </div>

            {/* Left aligned */}
            <div className="p-8 bg-card border border-border rounded-2xl">
              <SectionHeader
                badge="Left Aligned"
                badgeVariant="success"
                title="왼쪽 정렬 헤더"
                subtitle="왼쪽 정렬된 섹션 헤더"
                align="left"
              />
            </div>

            {/* Warning variant */}
            <div className="p-8 bg-card border border-border rounded-2xl">
              <SectionHeader
                badge="Warning"
                badgeVariant="warning"
                title="경고 배지 헤더"
                subtitle="노란색 경고 배지를 사용한 헤더"
              />
            </div>
          </div>
        </div>

        {/* DataCard 테스트 */}
        <div className="mb-24">
          <h2 className="text-headline mb-8">2. DataCard</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Success card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.6 }}
            >
              <DataCard
                value="99%"
                valueColor="success"
                title="AI 정확도"
                description="음성 인식 정확도가 99%에 달합니다. 업계 최고 수준의 성능을 자랑합니다."
                footer={
                  <p className="text-caption text-success">
                    검증 완료 →
                  </p>
                }
              />
            </motion.div>

            {/* Destructive card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <DataCard
                value="₩8.7조"
                valueColor="destructive"
                title="중대재해처벌법"
                description="2023년 기준 건설업 산재 사망자 441명. 경영책임자 형사처벌과 50억 벌금."
                footer={
                  <p className="text-caption text-destructive">
                    실시간 모니터링 필수 →
                  </p>
                }
              />
            </motion.div>

            {/* Primary card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <DataCard
                value="72시간"
                valueColor="primary"
                title="의사결정 지연"
                description="현장 문제가 본사에 보고되기까지 평균 3일. 그 사이 경쟁사는 이미 대응을 끝냈습니다."
                footer={
                  <p className="text-caption text-primary">
                    초 단위 실시간 대응 →
                  </p>
                }
              />
            </motion.div>

            {/* Accent card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <DataCard
                value="-23%"
                valueColor="accent"
                title="숙련 인력 감소"
                description="2030년까지 건설 숙련공 50만명 부족. 남은 인력의 생산성이 생존을 결정합니다."
                footer={
                  <p className="text-caption text-accent">
                    AI 협업으로 생산성 3배 →
                  </p>
                }
              />
            </motion.div>
          </div>
        </div>

        {/* SectionBadge 테스트 */}
        <div className="mb-24">
          <h2 className="text-headline mb-8">3. SectionBadge</h2>

          <div className="p-8 bg-card border border-border rounded-2xl">
            <div className="flex flex-wrap gap-4">
              <SectionBadge variant="default">Default Badge</SectionBadge>
              <SectionBadge variant="success">Success Badge</SectionBadge>
              <SectionBadge variant="warning">Warning Badge</SectionBadge>
              <SectionBadge variant="default">Why Now?</SectionBadge>
              <SectionBadge variant="success">완료</SectionBadge>
              <SectionBadge variant="warning">주의</SectionBadge>
            </div>
          </div>
        </div>

        {/* Typography 테스트 */}
        <div className="mb-24">
          <h2 className="text-headline mb-8">4. Typography System</h2>

          <div className="space-y-8 p-8 bg-card border border-border rounded-2xl">
            <div>
              <p className="text-caption text-muted-foreground mb-2">text-hero</p>
              <h1 className="text-hero">Hero Text</h1>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-display-1</p>
              <h2 className="text-display-1">Display 1</h2>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-display-2</p>
              <h2 className="text-display-2">Display 2</h2>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-headline</p>
              <h3 className="text-headline">Headline</h3>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-body-large</p>
              <p className="text-body-large">Large body text for emphasis</p>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-data-large</p>
              <p className="text-data-large text-primary">₩12,345,678</p>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-data</p>
              <p className="text-data">99.87%</p>
            </div>

            <div>
              <p className="text-caption text-muted-foreground mb-2">text-caption</p>
              <p className="text-caption">Caption Text</p>
            </div>
          </div>
        </div>

        {/* Colors 테스트 */}
        <div className="mb-24">
          <h2 className="text-headline mb-8">5. Color System</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-primary rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Primary</h4>
              <p className="text-sm text-muted-foreground">Safety Orange</p>
              <code className="text-xs text-data">hsl(18 95% 50%)</code>
            </div>

            {/* Secondary */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-secondary rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Secondary</h4>
              <p className="text-sm text-muted-foreground">Steel Gray</p>
              <code className="text-xs text-data">hsl(215 25% 27%)</code>
            </div>

            {/* Accent */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-accent rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Accent</h4>
              <p className="text-sm text-muted-foreground">Warning Yellow</p>
              <code className="text-xs text-data">hsl(45 100% 51%)</code>
            </div>

            {/* Success */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-success rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Success</h4>
              <p className="text-sm text-muted-foreground">Safety Green</p>
              <code className="text-xs text-data">hsl(142 71% 45%)</code>
            </div>

            {/* Destructive */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-destructive rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Destructive</h4>
              <p className="text-sm text-muted-foreground">Alert Red</p>
              <code className="text-xs text-data">hsl(0 84% 60%)</code>
            </div>

            {/* Muted */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="w-full h-24 bg-muted rounded-lg mb-4"></div>
              <h4 className="font-semibold mb-2">Muted</h4>
              <p className="text-sm text-muted-foreground">Dust Gray</p>
              <code className="text-xs text-data">hsl(210 15% 92%)</code>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
