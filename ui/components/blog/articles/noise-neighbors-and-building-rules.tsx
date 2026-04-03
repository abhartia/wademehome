import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function NoiseNeighborsAndBuildingRules() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Starting with good-faith conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Shared walls mean shared sound. Many noise issues resolve with a polite,
            specific conversation: what hours are loud for you, whether bass travels through
            floors, or if a home office needs quiet during calls. Assume ignorance before
            malice—neighbors may not realize how thin the construction is. Offer
            reciprocity: you will avoid vacuuming at dawn if they keep music down after 10
            p.m. Document dates if problems persist; you may need a timeline for management.
          </p>
          <p>
            When direct conversation fails, follow the building&apos;s process: front desk,
            resident portal, or property manager in writing. Quote quiet hours from the house
            rules if they exist. Escalate proportionally—calling police for minor noise
            strains community relationships and should be reserved for genuine disturbances
            or safety threats, depending on local norms.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>House rules, amenities, and when law gets involved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            House rules typically cover guest policies, instrument practice, pet behavior in
            halls, and common-area hours. Knowing them helps you advocate fairly—for yourself
            and others. If a neighbor violates rules repeatedly, management may warn or fine
            under the lease; outcomes vary. Chronic noise that breaches local nuisance
            ordinances may involve municipal enforcement, but that path is slower and more
            adversarial.
          </p>
          <p>
            If you are the noisy party—kids, instruments, home gym—invest in rugs, isolation
            pads, and scheduling. Headphones beat speaker systems for late-night listening.
            Good neighbor habits reduce complaints that could threaten your lease. This
            article is practical guidance, not legal advice; harassment and discrimination
            raise different issues that deserve qualified help.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Soundproofing, scheduling, and building in shared spaces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rugs with pads, door sweeps, and felt furniture feet reduce impact noise for
            downstairs neighbors. If you work odd hours, schedule loud tasks—vacuuming,
            blender use—when most people are awake. For musicians, practice mute devices,
            digital pianos with headphones, and communication with neighbors about rehearsal
            windows reduce complaints before they start.
          </p>
          <p>
            Amenities like gyms and party rooms have hours for a reason; using them outside
            posted times can violate house rules even if you are not bothering neighbors in
            your unit. Package rooms and loading docks also generate noise—be mindful during
            early mornings. A little predictability in shared buildings goes further than
            occasional gift baskets after problems escalate.
          </p>
          <p>
            If you document noise complaints, keep a calm tone in writing—future readers may
            include judges or mediators. Focus on dates, durations, and impact on sleep or
            work rather than personal attacks. Sustainable buildings require everyone to carry
            some inconvenience; the goal is fairness, not silence at all hours.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
