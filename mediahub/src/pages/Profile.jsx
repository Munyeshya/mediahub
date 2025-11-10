import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Phone, Mail, Globe, Briefcase, DollarSign, Upload, Zap, User } from "lucide-react";
import { FramerParticleBackground } from "../components/common/FramerParticleBackground";
import { toast } from "react-toastify";

const SERVICE_CATEGORIES = ['Photography', 'Videography', 'Audio Production', 'Graphics & Design', 'Web Development'];
const CITY_OPTIONS = ['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Rusizi'];

export function Profile() {
  const [role, setRole] = useState("giver");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    phone: "",
    website: "",
    category: "",
    city: "",
    rate: "",
    portfolioLinks: [""],
  });

  const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/profile/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit profile");
      toast.success("Profile created successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white relative min-h-screen overflow-x-hidden">
      <FramerParticleBackground />
      <div className="mx-auto max-w-5xl px-8 py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Create Your <span className="text-amber-500">Profile</span>
        </h1>

        {/* ROLE SELECTION */}
        <div className="mb-8">
          <Label className="text-white mb-2 block text-lg">Select Account Type</Label>
          <RadioGroup
            value={role}
            onValueChange={setRole}
            className="flex space-x-8 text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="giver" id="giver" />
              <Label htmlFor="giver">Creative / Service Giver</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client" id="client" />
              <Label htmlFor="client">Client / Project Owner</Label>
            </div>
          </RadioGroup>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SHARED FIELDS */}
          <Card className="bg-gray-800 border-t-4 border-amber-500">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <User className="h-6 w-6 mr-2 text-amber-500" /> Identity & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                placeholder={role === "giver" ? "Brand or Name" : "Full Name"}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                required
              />
            </CardContent>
          </Card>

          {/* GIVER-SPECIFIC FIELDS */}
          {role === "giver" && (
            <>
              <Card className="bg-gray-800 border-t-4 border-amber-500">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Briefcase className="h-6 w-6 mr-2 text-amber-500" /> Service & Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Select onValueChange={(v) => handleChange("category", v)}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue placeholder="Select Service Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <RadioGroup
                    value={form.city}
                    onValueChange={(v) => handleChange("city", v)}
                    className="flex flex-wrap gap-4"
                  >
                    {CITY_OPTIONS.map((city) => (
                      <div key={city} className="flex items-center space-x-2">
                        <RadioGroupItem value={city} id={city} />
                        <Label htmlFor={city}>{city}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Input
                    type="number"
                    placeholder="Hourly Rate (RWF)"
                    value={form.rate}
                    onChange={(e) => handleChange("rate", e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white"
                  />

                  <Textarea
                    placeholder="Professional Bio"
                    rows={4}
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </CardContent>
              </Card>

              {/* PORTFOLIO SECTION */}
              <Card className="bg-gray-800 border-t-4 border-amber-500">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Camera className="h-6 w-6 mr-2 text-amber-500" /> Portfolio Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {form.portfolioLinks.map((link, i) => (
                    <Input
                      key={i}
                      placeholder={`Portfolio Link ${i + 1}`}
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...form.portfolioLinks];
                        newLinks[i] = e.target.value;
                        handleChange("portfolioLinks", newLinks);
                      }}
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleChange("portfolioLinks", [...form.portfolioLinks, ""])
                    }
                    className="text-amber-500 border-amber-500 hover:bg-amber-900/20"
                  >
                    + Add Another Link
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-lg py-6 px-10 font-bold"
            >
              Submit Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
