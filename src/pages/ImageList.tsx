import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/widgets/PageHeader';
import {
  Card,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import { HiDownload } from 'react-icons/hi';
import { isWithinInterval, sub } from 'date-fns';

const images = [
  {
    type: 'X-Ray',
    DateTimeOfExamination: 'May 15, 2024 14:30',
    imageUrl:
      'https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?q=80&w=2876&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    type: 'X-Ray',
    DateTimeOfExamination: 'April 15, 2024 10:00',
    imageUrl:
      'https://images.unsplash.com/photo-1522849696084-818b29dfe210?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const periodOptions: { [key: string]: number } = {
  all: Infinity,
  '1_week': 7,
  '3_month': 90,
  '6_months': 180,
  '1_year': 365,
  '3_year': 1095,
};

const ImageList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const isTypeMatch =
        !selectedType || selectedType === 'all' || image.type === selectedType;
      const isPeriodMatch =
        !selectedPeriod ||
        selectedPeriod === 'all' ||
        isWithinInterval(new Date(image.DateTimeOfExamination), {
          start: sub(new Date(), { days: periodOptions[selectedPeriod] }),
          end: new Date(),
        });

      return isTypeMatch && isPeriodMatch;
    });
  }, [selectedType, selectedPeriod]);

  const handleCheckboxChange = (index: number) => {
    const updatedSelectedImages = new Set(selectedImages);
    if (updatedSelectedImages.has(index)) {
      updatedSelectedImages.delete(index);
    } else {
      updatedSelectedImages.add(index);
    }
    setSelectedImages(updatedSelectedImages);
  };

  return (
    <div className="p-4 space-y-6">
      <PageHeader title="Choose images" />
      <div className="flex items-center gap-2 my-4">
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <SelectTrigger className="w-[140px] rounded-full">
            <SelectValue placeholder="Image Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="X-Ray">X-Ray</SelectItem>
            <SelectItem value="CT">CT</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[160px] rounded-full">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1_week">1 week</SelectItem>
            <SelectItem value="3_month">3 month</SelectItem>
            <SelectItem value="6_months">6 months</SelectItem>
            <SelectItem value="1_year">1 year</SelectItem>
            <SelectItem value="3_year">3 year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {filteredImages.map((image, index) => (
          <Card key={index} className="flex items-center p-4 rounded-3xl h-24">
            <img
              src={image.imageUrl}
              alt={image.type}
              className="w-16 h-16 rounded-2xl"
            />
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex flex-row items-center gap-2">
                <Typography.Large>{image.type}</Typography.Large>
              </div>
              <Typography.Muted>{`Taken on ${image.DateTimeOfExamination}`}</Typography.Muted>
            </div>
            <Checkbox
              checked={selectedImages.has(index)}
              onCheckedChange={() => handleCheckboxChange(index)}
            />
          </Card>
        ))}
      </div>
      <a href="/">
        <Button
          className="w-full rounded-full mt-6 h-14"
          disabled={selectedImages.size === 0}
        >
          <HiDownload className="mr-2" />
          Download Selected Images ({selectedImages.size})
        </Button>
      </a>
    </div>
  );
};

export default ImageList;
