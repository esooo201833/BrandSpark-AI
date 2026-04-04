'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Copy, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const templates = [
  {
    id: 1,
    name: 'Tech Startup Brand',
    category: 'Brand',
    description: 'Complete brand package for a tech startup',
    fields: {
      businessType: 'Technology',
      description: 'An innovative tech solution',
      targetAudience: 'Tech-savvy professionals'
    }
  },
  {
    id: 2,
    name: 'E-commerce Social Posts',
    category: 'Social',
    description: 'Pre-written social media campaigns for online stores',
    fields: {
      topic: 'New product launch',
      purpose: 'engagement',
      cta: 'Shop now'
    }
  },
  {
    id: 3,
    name: 'SaaS Landing Page',
    category: 'Landing',
    description: 'Persuasive copy for SaaS landing pages',
    fields: {
      productName: 'My SaaS Product',
      keyBenefit: 'Save time and money',
      targetAudience: 'Business owners'
    }
  },
  {
    id: 4,
    name: 'Agency Ad Hooks',
    category: 'Ads',
    description: 'Attention-grabbing headlines for ad campaigns',
    fields: {
      productName: 'Agency services',
      problem: 'Marketing challenges',
      targetAudience: 'Small businesses'
    }
  },
  {
    id: 5,
    name: 'Newsletter Campaigns',
    category: 'Email',
    description: 'Email subject lines and content ideas',
    fields: {
      emailPurpose: 'Weekly newsletter',
      offer: 'Exclusive insights'
    }
  },
  {
    id: 6,
    name: 'Product Launch Kit',
    category: 'Content',
    description: 'Full product description and marketing copy',
    fields: {
      productName: 'New Product',
      features: 'Feature 1, Feature 2, Feature 3',
      pricePoint: 'mid-range'
    }
  }
];

export default function TemplatesPage() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    description: '',
    prompt: ''
  });
  const [savedTemplates, setSavedTemplates] = useState<typeof newTemplate[]>([]);

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.description && newTemplate.prompt) {
      setSavedTemplates([...savedTemplates, newTemplate]);
      setNewTemplate({ name: '', category: '', description: '', prompt: '' });
      setShowNewTemplate(false);
      alert('✅ تم إنشاء القالب بنجاح!');
    } else {
      alert('⚠️ يرجى ملء جميع الحقول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Templates</h1>
          <p className="text-slate-600">Pre-built prompts to get started faster</p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex-1 space-y-3 mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{template.description}</p>

                {/* Preview of fields */}
                <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 space-y-1">
                  {Object.entries(template.fields).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" size="sm">
                  <Zap className="w-4 h-4" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Custom Template */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Create Custom Template</h3>
              <p className="text-sm text-slate-600">
                Save your frequently used prompts as templates for quick access
              </p>
            </div>
            <Button 
              className="gap-2"
              onClick={() => setShowNewTemplate(true)}
            >
              <Zap className="w-4 h-4" />
              New Template
            </Button>
          </div>
        </Card>

        {/* New Template Form Modal */}
        {showNewTemplate && (
          <Card className="p-6 bg-blue-50 border-blue-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">إنشاء قالب جديد</h3>
              <button 
                onClick={() => setShowNewTemplate(false)}
                className="p-1 hover:bg-blue-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم القالب
                </label>
                <Input
                  placeholder="مثلاً: قالب منتج ساخن"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الفئة
                </label>
                <Input
                  placeholder="مثلاً: Social Media"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الوصف
                </label>
                <Input
                  placeholder="وصف مختصر للقالب"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نص الطلب (Prompt)
                </label>
                <Textarea
                  placeholder="اكتب الطلب الذي تريد حفظه..."
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate({...newTemplate, prompt: e.target.value})}
                  className="h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleCreateTemplate}
                >
                  حفظ القالب
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewTemplate(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Custom Templates */}
        {savedTemplates.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">قوالبك المخصصة</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTemplates.map((template, idx) => (
                <Card key={idx} className="p-6 border-green-200 bg-green-50">
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {template.category}
                  </Badge>
                  <p className="text-sm text-slate-600 mt-2">{template.description}</p>
                  <p className="text-xs text-slate-600 mt-3 bg-white p-2 rounded line-clamp-2">
                    {template.prompt}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 gap-2" size="sm">
                      <Zap className="w-4 h-4" />
                      استخدم
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Prompt */}
        {savedTemplates.length === 0 && (
          <Card className="p-6 text-center bg-slate-100 border-slate-200">
            <p className="text-slate-600 mb-4">
              قوالب مخصصة متقدمة متاحة فقط في خطة Pro والأعلى
            </p>
            <Link href="/dashboard/pricing">
              <Button className="gap-2">
                <Zap className="w-4 h-4" />
                اعرض الخطط
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
