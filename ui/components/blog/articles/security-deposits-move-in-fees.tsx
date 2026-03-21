import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityDepositsMoveInFees() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security deposits: what they cover and how rules vary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            A security deposit is money the landlord holds against unpaid rent and damage
            beyond normal wear and tear. In many states, statutes cap the amount, require
            segregation in interest-bearing accounts, or mandate itemized deductions within
            a set number of days after move-out. Other jurisdictions leave more to contract.
            Because the details differ sharply by state and sometimes by city, you should
            verify current law for your location rather than relying on general articles—this
            piece highlights what to look for, not legal advice.
          </p>
          <p>
            Read your lease for the definition of &quot;normal wear and tear&quot; versus
            chargeable damage. Nail holes from picture hanging are often considered ordinary in
            many markets; large holes or smoke damage are not. Non-refundable fees—cleaning,
            admin, pet—should be labeled clearly and separated from the refundable deposit
            on your receipt where required.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Move-in fees and the full cash stack to get keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Move-in fees may cover keys, fobs, elevator reservations, or initial services.
            Some are negotiable; others are firm. Application and holding fees are usually
            distinct from the deposit—understand which payments apply to move-in and which
            are sunk costs if you walk away. If you pay by card, ask about processing
            surcharges.
          </p>
          <p>
            Document everything: signed lease, payment receipts, move-in inspection with
            photos, and any promises about refundability. If a landlord proposes a deposit
            above the legal cap or refuses to provide a receipt, consult local tenant
            resources. Keeping a paper trail is your best protection when thousands of
            dollars change hands at a stressful moment.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interest, escrow, and staying organized for move-out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            In states requiring interest on deposits, know whether you must provide a
            forwarding address to receive it at move-out or whether it credits annually.
            Escrow rules sometimes mandate separate bank accounts—if your landlord cannot
            explain where money is held, research whether that violates local law. Keep
            bank records of every transfer so your ledger matches theirs.
          </p>
          <p>
            Pet deposits may be refundable or non-refundable depending on statute and lease
            language; do not conflate them with monthly pet rent. When disputes arise,
            veterinary records and photos of pet-related damage help separate legitimate
            wear from negligence. As always, local counsel interprets statutes; this article
            highlights questions to ask.
          </p>
          <p>
            If you receive interest or pass-through earnings on deposits where required, file
            the tax forms your accountant recommends—amounts are often small but compliance
            matters. When landlords change ownership mid-lease, confirm in writing where
            your deposit transferred; gaps in chain-of-custody complicate move-out refunds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
