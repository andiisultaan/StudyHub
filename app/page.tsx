"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, BookOpen, Users, Map } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-28 text-center">
        <motion.div className="max-w-3xl mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Logo image added here */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Image src="/study-hub.png" alt="StudyHub Logo" width={150} height={150} className="mx-auto mb-6" />
          </motion.div>
          <h1 className="text-5xl font-bold tracking-tight">
            StudyHub
            <motion.span className="text-primary block mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
              AI-Powered Learning Roadmaps
            </motion.span>
          </h1>
          <p className="text-xl text-muted-foreground">Create personalized learning paths, join discussions, and master new skills with AI-guided education.</p>
          <motion.div className="flex justify-center pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
            <Button size="lg" asChild>
              <Link href="/create-roadmap">Create Your Roadmap</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.h2
          className="text-3xl font-bold text-center mb-16"
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          Your Journey to Mastery
        </motion.h2>
        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              transition: { staggerChildren: 0.2 },
            },
            hidden: {},
          }}
        >
          <FeatureCard icon={Brain} title="AI-Powered Roadmaps" description="Get personalized learning paths tailored to your goals and current knowledge level." />
          <FeatureCard icon={Map} title="Visual Learning Flow" description="Interactive flowmaps help you visualize your learning journey step by step." />
          <FeatureCard icon={BookOpen} title="Curated Resources" description="Access hand-picked learning materials from trusted sources for each topic." />
          <FeatureCard icon={Users} title="Community Support" description="Join discussions, ask questions, and learn from peers in our forum." />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <Card className="bg-primary/5 border-0 p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Join StudyHub to reach your learning goals faster, easier, and with more support. Transform your study experience today!.</p>
            <Link href="/sign-in">
              <Button size="lg" className="bg-primary">
                Get Started for Free
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
        <motion.div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}
