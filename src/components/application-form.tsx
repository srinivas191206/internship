import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  gender: z.string().min(1, "Select an option"),
  yearOfStudy: z.string().min(1, "Select an option"),
  college: z.string().trim().min(2, "Required").max(150),
  branch: z.string().trim().min(2, "Required").max(100),
  location: z.string().trim().min(2, "Required").max(100),
  linkedin: z.string().trim().url("Enter a valid URL").max(255),
  github: z.string().trim().url("Enter a valid URL").max(255),
  portfolio: z.string().trim().url("Enter a valid URL").max(255).optional().or(z.literal("")),
  skills: z.string().trim().min(10, "Tell us a bit more").max(2000),
  experience: z.string().trim().min(10, "Tell us a bit more").max(2000),
  projects: z.string().trim().min(10, "Share at least one project").max(2000),
  motivation: z.string().trim().min(20, "Share your motivation").max(2000),
  availability: z.string().min(1, "Select an option"),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:border-primary/60 focus:bg-input/80 focus:ring-2 focus:ring-ring/40";

const labelClass = "mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

function SectionTitle({ index, title, desc }: { index: string; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="font-display text-xs font-semibold text-primary">{index}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-destructive">{msg}</p>;
}

export function ApplicationForm() {
  const ref = useReveal<HTMLDivElement>();
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setResumeError("");
    if (f) {
      if (f.type !== "application/pdf") {
        setResumeError("Please upload a PDF file");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setResumeError("File must be under 5 MB");
        return;
      }
    }
    setResume(f);
  };

  const onSubmit = async (values: FormValues) => {
    if (!resume) {
      setResumeError("Please upload your resume");
      return;
    }
    try {
      const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
      
      if (!webhookUrl || webhookUrl.includes("PASTE_YOUR")) {
        await new Promise((r) => setTimeout(r, 1400));
        console.log("Application payload (Simulated)", { ...values, resumeName: resume.name });
      } else {
        // Convert file to base64
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(resume);
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
        });

        const payload = {
          ...values,
          resumeName: resume.name,
          fileData: fileData
        };

        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" }, // Simple content type to avoid CORS preflight
          body: JSON.stringify(payload),
        });
      }

      setSubmitted(true);
      reset();
      setResume(null);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <section id="apply" className="px-6 py-24 sm:py-32">
        <div className="glass-strong mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14 animate-[fade-in-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
            Application received
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Thank you for applying. Every application is reviewed carefully.
            Shortlisted candidates will be contacted directly with next steps and company details.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Submit another response
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="px-6 py-24 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Application</p>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
            Tell us about you
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            A few details so we can understand your background and what you've built.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-strong mt-12 space-y-12 rounded-3xl p-6 sm:p-10"
          noValidate
        >
          {/* Basic Details */}
          <div>
            <SectionTitle index="01" title="Basic Details" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name</label>
                <input className={fieldClass} placeholder="Jane Doe" {...register("fullName")} />
                <FieldError msg={errors.fullName?.message} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" className={fieldClass} placeholder="you@email.com" {...register("email")} />
                <FieldError msg={errors.email?.message} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" className={fieldClass} placeholder="+91 ..." {...register("phone")} />
                <FieldError msg={errors.phone?.message} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select className={fieldClass} defaultValue="" {...register("gender")}>
                  <option value="" disabled>Select…</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <FieldError msg={errors.gender?.message} />
              </div>
              <div>
                <label className={labelClass}>Current Year of Study</label>
                <select className={fieldClass} defaultValue="" {...register("yearOfStudy")}>
                  <option value="" disabled>Select…</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                  <option>Postgraduate</option>
                </select>
                <FieldError msg={errors.yearOfStudy?.message} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>College Name</label>
                <input className={fieldClass} placeholder="Your institution" {...register("college")} />
                <FieldError msg={errors.college?.message} />
              </div>
              <div>
                <label className={labelClass}>Branch / Department</label>
                <input className={fieldClass} placeholder="e.g., CSE, ECE" {...register("branch")} />
                <FieldError msg={errors.branch?.message} />
              </div>
              <div>
                <label className={labelClass}>Current Location</label>
                <input className={fieldClass} placeholder="City, State" {...register("location")} />
                <FieldError msg={errors.location?.message} />
              </div>
            </div>
          </div>

          {/* Profiles */}
          <div>
            <SectionTitle index="02" title="Professional Profiles" />
            <div className="grid gap-5">
              <div>
                <label className={labelClass}>LinkedIn Profile URL</label>
                <input type="url" className={fieldClass} placeholder="https://linkedin.com/in/…" {...register("linkedin")} />
                <FieldError msg={errors.linkedin?.message} />
              </div>
              <div>
                <label className={labelClass}>GitHub Profile URL</label>
                <input type="url" className={fieldClass} placeholder="https://github.com/…" {...register("github")} />
                <FieldError msg={errors.github?.message} />
              </div>
              <div>
                <label className={labelClass}>Portfolio / Personal Website <span className="ml-1 normal-case text-muted-foreground/70">(optional)</span></label>
                <input type="url" className={fieldClass} placeholder="https://yoursite.com" {...register("portfolio")} />
                <FieldError msg={errors.portfolio?.message} />
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div>
            <SectionTitle index="03" title="Skills & Experience" />
            <div className="grid gap-5">
              <div>
                <label className={labelClass}>Technical Skills</label>
                <textarea rows={4} className={fieldClass} placeholder="Python, Machine Learning, React, Automation, IoT, APIs..." {...register("skills")} />
                <FieldError msg={errors.skills?.message} />
              </div>
              <div>
                <label className={labelClass}>Experience / Previous Work</label>
                <textarea rows={5} className={fieldClass} placeholder="Describe internships, projects, freelance work, or relevant hands-on experience." {...register("experience")} />
                <FieldError msg={errors.experience?.message} />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <SectionTitle index="04" title="Projects" />
            <div>
              <label className={labelClass}>Relevant Projects</label>
              <textarea rows={5} className={fieldClass} placeholder="Share 2–3 relevant projects with brief descriptions and links if available." {...register("projects")} />
              <FieldError msg={errors.projects?.message} />
            </div>
          </div>

          {/* Motivation */}
          <div>
            <SectionTitle index="05" title="Motivation" />
            <div>
              <label className={labelClass}>Why are you interested in this internship?</label>
              <textarea rows={5} className={fieldClass} placeholder="What draws you in, what you hope to learn and contribute…" {...register("motivation")} />
              <FieldError msg={errors.motivation?.message} />
            </div>
          </div>

          {/* Availability + Resume */}
          <div>
            <SectionTitle index="06" title="Availability & Resume" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Availability</label>
                <select className={fieldClass} defaultValue="" {...register("availability")}>
                  <option value="" disabled>Select…</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Flexible</option>
                </select>
                <FieldError msg={errors.availability?.message} />
              </div>
              <div>
                <label className={labelClass}>Resume (PDF)</label>
                <label
                  htmlFor="resume"
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-input px-4 py-3 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-foreground"
                >
                  <span className="truncate">{resume ? resume.name : "Click to upload PDF"}</span>
                  <Upload className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-y-[-2px]" />
                </label>
                <input id="resume" type="file" accept="application/pdf" className="hidden" onChange={onResume} />
                <FieldError msg={resumeError} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:brightness-110 disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Application
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              By submitting, you confirm the information provided is accurate.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
